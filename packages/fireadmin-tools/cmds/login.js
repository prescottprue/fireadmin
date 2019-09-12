'use strict'
const login = require('../lib').login

/**
 * @name login
 * Login to fireadmin
 * @example <caption>Basic</caption>
 * fireadmin login
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
