import type { Config } from '@sveltejs/kit'

import type { MdsxPreprocessorConfig } from './preprocessor'

/**
 * Configure Mdsx.
 */
export type MdsxConfig = Omit<MdsxPreprocessorConfig, 'preprocessors'>

/**
 * Customize the Svelte module that gets created in-memory to render the Markdown file.
 */
export interface MdsxSvelteModuleConfig {
  /**
   * Vanilla JS content to inject directly into the `script` tag of the root Svelte module.
   */
  script?: string

  /**
   * Vanilla JS content to inject directly into the `<script context="module">` tag of the root Svelte module.
   */
  module?: string

  /**
   * Content to inject directly into the templating portion of the Svelte module.
   */
  template?: string

  /**
   * Content to inject directly into the `style` tag of the Svelte module.
   */
  style?: string
}

/**
 * Adds the mdsx pre-processor to the current Svelte config.
 */
export function withMdsx(svelteConfig: Config, mdsxConfig?: MdsxConfig): Config

export default withMdsx
