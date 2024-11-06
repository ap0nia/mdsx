// @ts-check

/**
 * For whatever reason, there are two issues re-exporting like this resolves:
 *
 * 1. Vite SSR can not find nested files from the `exports` field in the `package.json`.
 *    This file is an entry point that re-exports the implementation.
 * 2. Vite SSR seems to not like it when there is a file that is named the same as a folder with an `index.js`.
 */
export * from './floating-renderer-components/index.js'
