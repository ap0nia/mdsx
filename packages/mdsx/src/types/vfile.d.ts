type Blueprint = import('../preprocessor').Blueprint

declare global {
  declare module 'vfile' {
    import type { PreprocessorGroup, Processed as _Processed } from 'svelte/compiler'

    interface DataMap {
      /**
       * Additional files to watch.
       *
       * @see {@link _Processed.dependencies}
       */
      dependencies: string[]

      /**
       * Parsed frontmatter of the Markdown file.
       */
      matter: Record<string, any>

      /**
       * Svelte pre-processors to apply.
       * Internally, it will exclude the MDSX preprocessor itself.
       */
      preprocessors: PreprocessorGroup[]

      /**
       * The selected blueprint for the current Markdown file.
       *
       * A blueprint can override the default HTML elements used for the rendered Markdown
       * with custom Svelte components.
       */
      blueprint?: Blueprint

      /**
       * The elements that the blueprint will override.
       *
       * @example ['a', 'ol', 'code', 'pre']
       */
      components: string[]

      /**
       * Whether a floating node was found.
       *
       * The rendererFloatingSvelte transformer for shiki will add a custom node that
       * begins with the MDSX__Component__Floating prefix, which will toggle this boolean to true.
       */
      floating?: boolean
    }
  }
}
