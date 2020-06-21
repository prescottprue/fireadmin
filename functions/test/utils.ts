/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const sinon = require('sinon')
const functionsTest = require('firebase-functions-test')()
const sinonChai = require('sinon-chai')

chai.use(sinonChai)

/**
 * Create default mock functions config
 * @param {object} extraConfig - Extra config
 * @returns {Any} Returns results of mock config
 */
export function mockFunctionsConfig(extraConfig = {}) {
  return functionsTest.mockConfig({
    firebase: {
      databaseURL: 'https://some-project.firebaseio.com'
    },
    encryption: {
      password: 'asdf'
    },
    algolia: {
      app_id: 'asdf',
      api_key: 'asdf'
    },
    gmail: { email: 'test', password: 'test' },
    ...extraConfig
  })
}

// Stub Firebase's functions.config()
mockFunctionsConfig()

// Stub Firebase's config environment var
process.env.FIREBASE_CONFIG = JSON.stringify({
  databaseURL: 'https://some-project.firebaseio.com',
  storageBucket: 'some-bucket.appspot.com'
})
