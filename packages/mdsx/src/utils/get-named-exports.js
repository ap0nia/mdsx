// @ts-check

import { walk } from 'zimmerframe'

/**
 * @param {Record<string, any>} ast
 */
export function getNamedExports(ast) {
  /**
   * @type string[]
   */
  const exportedComponentNames = []

  const state = {}

  walk(ast['content'], state, {
    ExportNamedDeclaration(node) {
      for (const specifier of node.specifiers) {
        exportedComponentNames.push(specifier.exported.name)
      }
    },
  })

  return exportedComponentNames
}
