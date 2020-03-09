// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const cypressFirebasePlugin = require('cypress-firebase').pluginWithTasks
const admin = require('firebase-admin')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  require('cypress-plugin-retries/lib/plugin')(on)
  require('cypress-log-to-output').install(on, (type, event) => {
    // return true or false from this plugin to control if the event is logged
    // `type` is either `console` or `browser`
    // if `type` is `browser`, `event` is an object of the type `LogEntry`:
    //  https://chromedevtools.github.io/devtools-protocol/tot/Log#type-LogEntry
    // if `type` is `console`, `event` is an object of the type passed to `Runtime.consoleAPICalled`:
    //  https://chromedevtools.github.io/devtools-protocol/tot/Runtime#event-consoleAPICalled

    // if (event.level === 'error' || event.type === 'error') {
    //   return true
    // }

    return true
  })
  // Extends with config from .firebaserc
  return cypressFirebasePlugin(on, config, admin)
}
