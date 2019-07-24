'use strict'
const runAction = require('../lib').runAction

/**
 * @name project
 * @description Get name of the firebase project associated with the current CI environment.
 * @example <caption>Basic</caption>
 * echo "Project to deploy to $(firebase-ci project)"
 * // => "Project to deploy to my-project"
 */
module.exports = function(program) {
  program
    .command('action')
    .description('Run an action template')
    .action(directory => {
      return runAction(directory)
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
    })
}
