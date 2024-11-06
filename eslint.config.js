// @ts-check

import prettier from 'eslint-config-prettier'
import simpleImport from 'eslint-plugin-simple-import-sort'
import svelte from 'eslint-plugin-svelte'
import globals from 'globals'
import svelteParser from 'svelte-eslint-parser'
import tsEslint from 'typescript-eslint'

import eslint from '@eslint/js'

/**
 * ESLint uses minimatch patterns to determine which files to apply rules to.
 *
 * @see https://eslint.org/docs/latest/use/configure/configuration-files#specifying-files-and-ignores
 * @see https://github.com/isaacs/minimatch?tab=readme-ov-file#features
 */
const FILE_PATTERNS = {
  // Source code.
  TYPESCRIPT: '**/*.ts',
  JAVASCRIPT: '**/*.js',
  JAVASCRIPT_XML: '**/*.jsx',
  TYPESCRIPT_XML: '**/*.tsx',
  SVELTE: '**/*.svelte',

  // Project files.
  NODE_MODULES: '**/node_modules/**',
  BUILD_OUTPUT: '**/build/**',
  SVELTEKIT_OUTPUT: '**/.svelte-kit/**',
  PARAGLIDE_MESSAGES_OUTPUT: '**/paraglide/messages/**',
  PARAGLIDE_RUNTIME_OUTPUT: '**/paraglide/runtime.js',
  CONFIG_JS: '**/*.config.js',
  CONFIG_COMMON_JS: '**/*.config.cjs',
  CONFIG_ECMASCRIPT_JS: '**/*.config.mjs',
}

/**
 * Enforce import/export order in all source code.
 *
 * Errors/warnings from this plugin are fixable with `--fix`.
 * For example `eslint --fix` will automatically sort all imports/exports.
 */
const importSortConfigs = tsEslint.config({
  files: [
    FILE_PATTERNS.TYPESCRIPT,
    FILE_PATTERNS.TYPESCRIPT_XML,
    FILE_PATTERNS.JAVASCRIPT,
    FILE_PATTERNS.JAVASCRIPT_XML,
    FILE_PATTERNS.SVELTE,
  ],
  plugins: {
    'simple-import-sort': simpleImport,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
})

/**
 * Configuration that applies to all TypeScript files.
 */
const typescriptConfigs = tsEslint.config(
  tsEslint.configs['base'],
  ...tsEslint.configs['recommended'],
  {
    files: [
      FILE_PATTERNS.TYPESCRIPT,
      FILE_PATTERNS.TYPESCRIPT_XML,
      FILE_PATTERNS.JAVASCRIPT,
      FILE_PATTERNS.JAVASCRIPT_XML,
      FILE_PATTERNS.SVELTE,
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      // Allow specifying a type as `any`.
      '@typescript-eslint/no-explicit-any': 'off',

      // Allow unused variables if they start with "_". For example: let _unusedVar = 'hello'
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^(_|\\$\\$)',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
)

/**
 */
const svelteConfigs = tsEslint.config({
  files: [FILE_PATTERNS.SVELTE],
  plugins: { svelte },
  processor: svelte.processors.svelte,
  languageOptions: {
    parser: svelteParser,
    parserOptions: {
      project: ['./tsconfig.json'],
      parser: '@typescript-eslint/parser',
      extraFileExtensions: ['.svelte'],
    },
    globals: {
      /**
       * Generic type recognized by Svelte.
       */
      $$Generic: false,
    },
  },
  rules: {
    ...svelte.configs.base.rules,
    ...svelte.configs.recommended.rules,
    'no-inner-declarations': 'off',

    // Sometimes, a variable is assigned to itself in a Svelte file to update state.
    'no-self-assign': 'off',
  },
})

/**
 * File patterns to ignore.
 */
const ignoresConfig = tsEslint.config({
  ignores: [
    FILE_PATTERNS.CONFIG_JS,
    FILE_PATTERNS.CONFIG_COMMON_JS,
    FILE_PATTERNS.CONFIG_ECMASCRIPT_JS,
    FILE_PATTERNS.NODE_MODULES,
    FILE_PATTERNS.SVELTEKIT_OUTPUT,
    FILE_PATTERNS.BUILD_OUTPUT,
    FILE_PATTERNS.PARAGLIDE_MESSAGES_OUTPUT,
    FILE_PATTERNS.PARAGLIDE_RUNTIME_OUTPUT,
  ],
})

const config = tsEslint.config(
  prettier,
  eslint.configs.recommended,
  tsEslint.configs.eslintRecommended,
  ...tsEslint.configs.recommended,
  ...importSortConfigs,
  ...typescriptConfigs,
  ...svelteConfigs,
  ...svelteConfigs,
  ...ignoresConfig,
)

export default config
