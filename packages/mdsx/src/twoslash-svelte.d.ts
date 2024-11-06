import type { TwoslashShikiReturn } from '@shikijs/twoslash'
import type { CreateTwoslashOptions, TwoslashExecuteOptions } from 'twoslash'

export interface CreateTwoslashSvelteOptions extends CreateTwoslashOptions {
  /**
   * Render the generated code in the output instead of the Svelte file
   *
   * @default false
   */
  debugShowGeneratedCode?: boolean
}

type TwoslashShikiFunction = (
  code: string,
  lang?: string,
  options?: TwoslashExecuteOptions,
) => TwoslashShikiReturn

export function createTwoslasher(createOptions?: CreateTwoslashSvelteOptions): TwoslashShikiFunction

export default createTwoslasher
