// @ts-check

const COMMANDS = {
  /**
   * Quietly lint the designated files and attempt to correct and issues before throwing an error.
   */
  LINT: 'eslint --quiet --fix',

  /**
   * Format and edit the designated files.
   */
  FORMAT: 'prettier --write',
}

const LINT_AND_FORMAT = [COMMANDS.LINT, COMMANDS.FORMAT]

/**
 * General Guideline:
 * - Files with logic, i.e. source code, should be both linted and formatted.
 * - All other files should at least be formatted.
 *
 * @type import('lint-staged').Config
 */
const config = {
  '*.svelte': LINT_AND_FORMAT,
  '*.js': LINT_AND_FORMAT,
  '*.jsx': LINT_AND_FORMAT,
  '*.ts': LINT_AND_FORMAT,
  '*.tsx': LINT_AND_FORMAT,

  '*.css': COMMANDS.FORMAT,
  '*.json': COMMANDS.FORMAT,
  '*.yml': COMMANDS.FORMAT,
  '*.yaml': COMMANDS.FORMAT,
}

module.exports = config
