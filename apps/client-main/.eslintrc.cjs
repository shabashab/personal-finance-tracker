module.exports = {
  extends: ['@inc-dev'],
  parserOptions: {
    project: [
      require.resolve('./tsconfig.json')
    ],
    extraFileExtensions: ['.vue'],
  },
  overrides: [
    {
      files: ['*.vue'],
      extends: ['@inc-dev/eslint-config-vue', 'plugin:tailwindcss/recommended'],
      rules: {
        'prettier/prettier': 'off',
        'no-undef': 'off',
      },
    },
  ],
  rules: {
    'no-undef': 'off',
  },
}
