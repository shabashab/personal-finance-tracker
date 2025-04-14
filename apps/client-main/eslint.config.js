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
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
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
    files: ['pages/**/*.vue', 'layouts/**/*.vue', 'components/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  }
)
