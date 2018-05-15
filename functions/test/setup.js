/* eslint-disable no-unused-vars */
process.env.NODE_ENV = 'test'

const chai = require('chai')
const sinon = require('sinon')
const functionsTest = require('firebase-functions-test')()
const sinonChai = require('sinon-chai')
const to = require('../src/utils/async').to

chai.use(sinonChai)

global.chai = chai
global.sinon = sinon
global.expect = chai.expect
global.assert = chai.assert
global.functionsTest = functionsTest
global.to = to
