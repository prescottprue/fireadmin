module.exports = {
  'extends': ['react-app', 'prettier'],
  root: true,
  parser: 'babel-eslint',
  plugins: ['import', 'babel', 'react', 'prettier'],
  settings: {
    react: {
      version: '16.6'
    },
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '/']
      }
    }
  },
  globals: {
    '__DEV__': false,
    '__COVERAGE__': false,
    '__TEST__': false,
    StackdriverErrorReporter: false,
    Raven: false
  },
  rules: {
    semi: [2, 'never'],
    'no-console': 'error',
    'jsx-quotes': ['error', 'prefer-double'],
    'react/forbid-prop-types': 0,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': 0,
    'import/no-named-as-default': 0,
    'no-return-await': 2,
    'node/no-deprecated-api': 0,
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
  },
  overrides: [
    {
      files: ['./src/**/*.test.js', './src/**/*.spec.js'],
      env: {
        jest: true
      }
    },
    {
      files: ['./scripts/*'],
      rules: {
        'no-console': 0,
        'func-names': 0,
        'prefer-destructuring': 0,
        'no-use-before-define': 0,
        'import/order': 0,
        'consistent-return': 0,
        'no-param-reassign': 0,
        'import/no-extraneous-dependencies': 0,
        'global-require': 0,
        'import/no-dynamic-require': 0
      }
    }
  ]
}
