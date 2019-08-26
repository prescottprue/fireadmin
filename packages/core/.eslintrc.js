module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  'extends': [
    'plugin:@typescript-eslint/eslint-recommended',
    'standard',
    'standard-react',
    'prettier',
    'prettier/react',
    "prettier/@typescript-eslint",
  ],
  plugins: [
    'babel',
    'react',
    'prettier',
    '@typescript-eslint'
  ],
  env: {
    browser: true,
    es6: true,
    node: true
  },
  rules: {
    semi: [2,'never'],
    'no-console': 'error',
    'jsx-quotes': [
      'error',
      'prefer-double'
    ],
    'no-return-await': 2,
    'node/no-deprecated-api': 0,
    // TODO: Re-enable once issue in typescript-eslint is merged: https://github.com/typescript-eslint/typescript-eslint/pull/688
    'no-unused-vars': 0, 
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'none',
        semi: false,
        bracketSpacing: true,
        jsxBracketSameLine: true,
        printWidth: 80,
        tabWidth: 2,
        useTabs: false
      }
    ]
  }
}
