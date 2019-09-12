'use strict'
const getProjects = require('../lib').getProjects

/**
 * @name projects
 * Get name of the firebase project associated with the current CI environment.
 * @example <caption>Basic</caption>
 * fireadmin projects
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
