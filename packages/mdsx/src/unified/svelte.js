// @ts-check

// Hast + Svelte utilites.

/**
 * Creates nodes that can be restructured into a Svelte snippet.
 *
 * @param {string} snippet Name of the snippet.
 * @param {*} props Props to provide to the child. Must be JSON-serializable due to limitations in parsing.
 * @param {import('hast').Element} children
 * @returns {import('hast').Element[]}
 *
 * @example Resulting template.
 *
 * ```html
 * {#snippet child({ a: 123 })}
 *   <a href="/">Link</a>
 * {/snippet}
 * ```
 *
 * The child can have be an element, which will be lowered separately from the raw `snippet` directives.
 */
export function createSnippet(snippet, props, children) {
  /** @type import('hast').Element */
  const openingSnippet = /** @type any */ ({
    type: 'raw',
    value: `{#snippet ${snippet}(${props ? JSON.stringify(props) : ''})}`,
  })

  /** @type import('hast').Element */
  const closingSnippet = /** @type any */ ({
    type: 'raw',
    value: '{/snippet}',
  })

  return [openingSnippet, children, closingSnippet]
}
