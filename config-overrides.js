const utils = require('customize-cra') // eslint-disable-line import/no-extraneous-dependencies

module.exports = utils.override(
  utils.useEslintRc(),
  // utils.disableEsLint(),
  utils.useBabelRc()
)
