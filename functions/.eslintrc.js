module.exports = {
  'extends': ['../.eslintrc.js', /* "plugin:jsdoc/recommended" */],
  rules: {
    'no-console': 0,
    // 'jsdoc/newline-after-description': 0
  },
  overrides: [
    {
      files: ['test/unit/*.spec.js'],
      env: {
        mocha: true
      },
      globals: {
        functionsTest: true,
        expect: true,
        sinon: true
      },
      rules: {
        'import/no-dynamic-require': 0,
        'no-unused-expressions': 0,
        'import/prefer-default-export': 0
      }
    }
  ]
}