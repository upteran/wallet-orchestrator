import js from '@eslint/js'
import sveltePlugin from 'eslint-plugin-svelte'
import svelteParser from 'svelte-eslint-parser'
import tseslint from 'typescript-eslint'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...sveltePlugin.configs['flat/recommended'],
  {
    languageOptions: {
      parserOptions: {
        extraFileExtensions: ['.svelte'],
        project: true
      },
      sourceType: 'module'
    }
  },
  {
    files: ['**/*.svelte'],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tseslint.parser
      }
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      sveltePlugin
    },
    processor: 'svelte/svelte',
    rules: {
      'import/first': 'off',
      'no-undef-init': 'off',
      'no-use-before-define': 'off',
      'svelte/block-lang': ['error', { script: 'ts' }],
      'svelte/infinite-reactive-loop': 'error',
      'svelte/no-at-debug-tags': 'error',
      'svelte/no-extra-reactive-curlies': 'error',
      'svelte/no-reactive-literals': 'error',
      'svelte/no-reactive-reassign': 'error',
      'svelte/no-unused-class-name': 'warn',
      'svelte/prefer-class-directive': 'error',
      'svelte/require-each-key': 'error',
      'svelte/require-optimized-style-attribute': 'error',
      'svelte/sort-attributes': 'error',
      'svelte/spaced-html-comment': 'error'
    }
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        project: true
      }
    }
  }
]
