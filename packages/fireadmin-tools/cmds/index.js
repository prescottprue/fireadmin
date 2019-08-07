'use strict'

module.exports = function(client) {
  process.env.FORCE_COLOR = true
  var loadCommand = function(name) {
    return require('./' + name)(client)
  }

  client.project = loadCommand('projects')
  client.login = loadCommand('login')
  client.action = loadCommand('action')

  return client
}
