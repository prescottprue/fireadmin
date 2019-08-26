'use strict'
const getProjects = require('../lib').getProjects

/**
 * @name project
 * @description Get name of the firebase project associated with the current CI environment.
 * @example <caption>Basic</caption>
 * echo "Project to deploy to $(firebase-ci project)"
 * // => "Project to deploy to my-project"
 */
module.exports = function(program) {
  program
    .command('projects')
    .description('Get list of projects')
    .action((directory, options) => {
      return getProjects(opts)
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
    })
}
