// @ts-check

import path from 'node:path'

import { print } from 'esrap'
import MagicString from 'magic-string'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { parse, preprocess } from 'svelte/compiler'
import { unified } from 'unified'
import { VFile } from 'vfile'

import {
  DEFAULT_MARKDOWN_EXTENSIONS,
  MDSX_BLUEPRINT_NAME,
  MDSX_COMPONENT_NAME,
  MDSX_FLOATING_COMPONENT_NAME,
} from './constants.js'
import { rehypeBlueprint, rehypeGetFloating, rehypeRenderCode } from './unified/rehype.js'
import { remarkCleanSvelte } from './unified/remark.js'
import { parseFrontmatter } from './utils/parse-frontmatter.js'
import { getRelativeFilePath } from './utils/path.js'

/**
 * Generate a string representing the `<script context="module">` part of a Svelte component.
 *
 * @param {*} ast
 * @param {VFile} file
 * @returns {string}
 *
 * @example
 * ```html
 * <script context="module">
 *   export const metadata = { title: '', description: '' }
 *   const { title, description } = metadata
 * </script>
 * ```
 */
function createSvelteModule(ast, file) {
  const matter = file.data.matter ?? {}

  const metadata = JSON.stringify(matter)
  const metadataKeys = Object.keys(matter)
  const processedAst = ast?.content ? print(ast.content) : undefined

  const exportStatement = `export const metadata = ${metadata};\n`
  const metadataDeclaration = `const { ${metadataKeys.join(', ')} } = metadata;\n`
  const code = processedAst?.code ?? ''

  const content = `<script context="module">${exportStatement}${metadataDeclaration}${code}</script>`
  return content
}

/**
 * Generate a string representing the `<script>` part of a Svelte component.
 *
 * @param {*} ast
 * @param {VFile} file
 * @returns {string}
 */
function createSvelteInstance(ast, file) {
  const parsedAst = ast?.content ? print(ast.content) : undefined
  const code = parsedAst?.code ?? ''

  const lines = ['<script>', code]

  if (file.data.blueprint) {
    const importPath = getRelativeFilePath(file.path, file.data.blueprint.path)
    const blueprintImportStatement = `\timport ${MDSX_BLUEPRINT_NAME}, * as ${MDSX_COMPONENT_NAME} from "${importPath}";`
    lines.push(blueprintImportStatement)
  }

  if (file.data.floating) {
    const floatingImportStatement = `\timport * as ${MDSX_FLOATING_COMPONENT_NAME} from '@ap0nia/mdsx/floating-renderer-components';`

    lines.push(floatingImportStatement)
  }

  lines.push('</script>')

  const content = lines.join('\n')
  return content
}

/**
 * @param {VFile} file
 * @param {import('./preprocessor.js').MdsxPreprocessorConfig} config
 */
function getBlueprintData(file, config) {
  if (!config?.blueprints) return

  const blueprintName = file.data.matter?.['blueprint'] ?? 'default'

  if (blueprintName === false) return

  if (typeof blueprintName !== 'string') {
    throw new Error(`The "blueprint" name in the frontmatter must be a string in "${file.path}"`)
  }

  const blueprint = config.blueprints[blueprintName]

  if (blueprint == null) {
    const allBluePrints = JSON.stringify(config.blueprints, null, 2)
    throw Error(`"${blueprintName}" was not found in the provided blueprints, ${allBluePrints}`)
  }

  Object.assign(blueprint, {
    name: blueprintName,
    unified: blueprint.unified,
  })

  return blueprint
}

/**
 * @param {Parameters<import('./preprocessor.js').MarkupPreprocessor>[0]} options
 * @param {import('./preprocessor.js').MdsxPreprocessorConfig} config
 * @returns {Promise<import('svelte/compiler').Processed>}
 */
export async function compile(options, config) {
  const source = options.filename ?? ''
  const filename = source

  /**
   * @type import('vfile').Data
   */
  const data = {
    dependencies: [],
    instance: null,
    matter: {},
    preprocessors: [],
    components: [],
    ...config,
  }

  const file = new VFile({ value: options.content, path: source, data })

  const frontmatter = parseFrontmatter(file, config.frontmatterParser)

  file.data['matter'] = frontmatter.matter

  if (frontmatter.value) {
    file.value = frontmatter.value
  }

  const blueprint = getBlueprintData(file, config)

  /**
   * @type import('./preprocessor.js').AnyProcessor
   */
  // First, use all the core remark plugins.
  let processor = unified()
    .use(remarkParse)
    .use(remarkCleanSvelte)
    .use(remarkRehype, { allowDangerousHtml: true })

  // User can add or override the processor as desired.

  processor = (await config.unified?.(processor, config)) ?? processor

  if (blueprint) {
    data.dependencies?.push(blueprint.path)
    data.blueprint = blueprint
    processor = (await blueprint.unified?.(processor, config)) ?? processor
  }

  const preprocessors = config.preprocessors ?? []

  // Finally, use all the core rehype plugins.
  processor = processor
    .use(rehypeBlueprint)
    .use(rehypeRenderCode)
    .use(rehypeGetFloating)
    .use(rehypeStringify, { allowDangerousHtml: true })

  const processed = await processor.process(file)

  const { code, dependencies } = await preprocess(String(processed), preprocessors, { filename })

  if (dependencies) {
    data.dependencies?.push(...dependencies)
  }

  const parsed = parse(code)

  const s = new MagicString(code)

  if (blueprint == null) {
    /**
     * @type import('svelte/compiler').Processed
     */
    const compiled = {
      code: s.toString(),
      map: s.generateMap({ source }),
      dependencies: data.dependencies,
    }

    return compiled
  }

  // Remove existing svelte instance script.
  if (parsed['instance']) {
    s.remove(parsed['instance'].start, parsed['instance'].end)
  }

  // Remove existing svelte module script
  if (parsed['module']) {
    s.remove(parsed['module'].start, parsed['module'].end)
  }

  // Prepend styles first, overriding any existing styles.
  if (parsed['css']) {
    s.remove(parsed['css'].start, parsed['css'].end)
    const cssContent = s.original.substring(parsed['css'].start, parsed['css'].end)
    s.prepend(cssContent)
  }

  // Prepend template.
  s.prepend(`<${MDSX_BLUEPRINT_NAME} {metadata}>\n`)
  s.append(`</${MDSX_BLUEPRINT_NAME}>\n`)

  // Prepend new svelte instance script.
  const svelteInstance = createSvelteInstance(parsed['instance'], file)
  s.prepend(svelteInstance)

  // Prepend new svelte module script.
  const svelteModule = createSvelteModule(parsed['module'], file)
  s.prepend(svelteModule)

  /**
   * @type import('svelte/compiler').Processed
   */
  const compiled = {
    code: s.toString(),
    map: s.generateMap({ source }),
    dependencies: data.dependencies,
  }

  return compiled
}

/**
 * @type import('./preprocessor.js').createMdsxPreprocessor
 */
export function createMdsxPreprocessor(config) {
  const extensions = config?.extensions ?? DEFAULT_MARKDOWN_EXTENSIONS

  /**
   * @type import('svelte/compiler').PreprocessorGroup
   */
  const mdsxPreprocessor = {
    name: 'mdsx',
    markup: async (options) => {
      if (options.filename == null) return

      const fileExtension = path.extname(options.filename)

      if (!extensions.includes(fileExtension)) return

      return compile(options, config)
    },
  }

  return mdsxPreprocessor
}
