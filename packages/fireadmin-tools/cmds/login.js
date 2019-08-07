'use strict'
const login = require('../lib').login

/**
 * @name project
 * @description Get name of the firebase project associated with the current CI environment.
 * @example <caption>Basic</caption>
 * echo "Project to deploy to $(firebase-ci project)"
 * // => "Project to deploy to my-project"
 */
module.exports = function(program) {
  program
    .command('login')
    .description('login')
    .action((directory, opts) => {
      return login(opts)
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
    })
}
