'use strict'

module.exports = function(client) {
  process.env.FORCE_COLOR = true
  var loadCommand = function(name) {
    return require('./' + name)(client)
  }

  client.project = loadCommand('projects')
  client.project = loadCommand('action')

  return client
}
