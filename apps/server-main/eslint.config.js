import { extendConfig as extendBaseConfig } from '@inc-dev/eslint-config'
import { globalIgnores } from 'eslint/config'
import path from 'node:path'

export default extendBaseConfig(
  globalIgnores(['dist/**/*', 'node_modules/**/*']),
  {
    languageOptions: {
      parserOptions: {
        project: [
          path.resolve(import.meta.dirname, './tsconfig.json'),
          path.resolve(import.meta.dirname, './tsconfig.config.json'),
          path.resolve(import.meta.dirname, './tests/tsconfig.json'),
        ],
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/restrict-template-expressions': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { args: 'after-used' }],
      // This starts creating a lot of errors with @mikrokit/di
      '@typescript-eslint/require-await': 'off',
      // unfortunately it doesn't fit our framework :(
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/prefer-export-from': 'off',
      curly: 'error',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          allowList: {
            db: true,
            utils: true,
            params: true,
            Params: true,
            def: true,
            defs: true,
          },
        },
      ],
    },
  },
  {
    files: ['tests/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
    },
  }
)
