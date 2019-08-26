'use strict'
const useProject = require('../lib').useProject

/**
 * @name use
 * @description Set a specific fireadmin project as the current project
 * @example <caption>Basic</caption>
 * fireadmin use cider
 * // => "Project to deploy to my-project"
 */
module.exports = function(program) {
  program
    .command('use')
    .description('Set the current project')
    .action(directory => {
      return useProject(directory)
        .then(() => process.exit(0))
        .catch(() => process.exit(1))
    })
}
