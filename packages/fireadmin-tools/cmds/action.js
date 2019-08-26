'use strict'
const runCustomAction = require('../lib').runCustomAction

/**
 * @name action
 * @description Get name of the firebase project associated with the current CI environment.
 * @example <caption>Basic</caption>
 * fireadmin action
 * // => "Project to deploy to my-project"
 */
module.exports = function(program) {
  program
    .command('action')
    .description('Run an action template (locally or remotley)')
    .action(directory => {
      return runCustomAction(directory)
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
    })
}
