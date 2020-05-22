module.exports = {
  extends: ['../.eslintrc.js', 'plugin:jsdoc/recommended'],
  plugins: ['node', 'jsdoc'],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', '/']
      }
    }
  },
  rules: {
    'no-console': 0,
    'no-return-await': 2,
    'jsdoc/newline-after-description': 0,
    'jsdoc/no-undefined-types': 0
  },
  overrides: [
    {
      files: ['./test/unit/**/*.spec.js'],
      env: {
        mocha: true
      },
      globals: {
        sinon: true,
        expect: true,
        should: true,
        functionsTest: true,
        mockFunctionsConfig: true
      },
      rules: {
        'jsdoc/require-returns': 0,
        'jsdoc/require-param-description': 0,
        'jsdoc/require-param-type': 0,
        'no-console': 0,
        'import/no-dynamic-require': 0,
        'no-unused-expressions': 0,
        'import/prefer-default-export': 0,
        'no-return-await': 2
      }
    }
  ]
}
