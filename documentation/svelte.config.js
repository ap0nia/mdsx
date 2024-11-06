// @ts-check

import path from 'node:path'
import url from 'node:url'

// import adapter from '@sveltejs/adapter-static'
import adapter from '@sveltejs/adapter-auto'
import { createTwoslasher } from '@ap0nia/mdsx/twoslash-svelte'
import { withMdsx } from '@ap0nia/mdsx'
import { rendererFloatingSvelte } from '@ap0nia/mdsx/floating-renderer-svelte'
import { transformerTwoslash } from '@shikijs/twoslash'
import shikiRehype from '@shikijs/rehype'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * @type import('@sveltejs/kit').Config
 */
const config = {
  kit: {
    adapter: adapter(),
    alias: {
      $content: './src/content',
    },
  },
  extensions: ['.svelte', '.md'],
}

const configWithMdsx = withMdsx(config, {
  blueprints: {
    default: {
      path: path.resolve(
        __dirname,
        './src/lib/components/markdown/blueprint-default/blueprint.svelte',
      ),
    },
  },
  unified: (processor) => {
    return processor.use(shikiRehype, {
      addLanguageClass: true,
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      transformers: [
        {
          name: 'vitepress:add-class',
          pre(node) {
            this.addClassToHast(node, 'vp-code')
          },
        },
        transformerTwoslash({
          langs: ['ts', 'tsx', 'svelte'],
          twoslasher: createTwoslasher(),
          renderer: rendererFloatingSvelte(),
        }),
      ],
    })
  },
})

export default configWithMdsx
