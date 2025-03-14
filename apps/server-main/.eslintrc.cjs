const path = require('path')

module.exports = {
  parserOptions: {
    project: [
      path.resolve(__dirname, 'tsconfig.json'),
      path.resolve(__dirname, 'tsconfig.config.json'),
    ],
  },
  rules: {
    'no-redeclare': 'off',
    'no-use-before-define': 'off',
    'no-unused-vars': 'off',
  },
}
