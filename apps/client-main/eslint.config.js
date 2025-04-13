import { extendConfig as extendBaseConfig } from '@inc-dev/eslint-config-vue'
import { globalIgnores } from 'eslint/config'
import path from 'node:path'
import ts from 'typescript-eslint'

export default extendBaseConfig(
  globalIgnores([
    'dist/**/*',
    'node_modules/**/*',
    '.nuxt/**/*',
    '.output/**/*',
  ]),
  {
    languageOptions: {
      parserOptions: {
        project: [path.resolve(import.meta.dirname, './tsconfig.json')],
      },
    },
    rules: {
      '@typescript-eslint/restrict-template-expressions': 'off',
      'no-undef': 'off',
      '@typescript-eslint/no-invalid-void-type': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            props: true,
          },
        },
      ],
    },
  },
  {
    files: ['*.vue', '**/*.vue'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        parser: ts.parser,
        project: [path.resolve(import.meta.dirname, './tsconfig.json')],
        sourceType: 'module',
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['pages/**/*.vue', 'layouts/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  }
)
