// @ts-check

import prettierPluginSvelte from 'prettier-plugin-svelte'

/**
 * @type import('prettier').Config
 */
const config = {
  semi: false,
  printWidth: 100,
  singleQuote: true,
  plugins: [prettierPluginSvelte],
}

export default config
