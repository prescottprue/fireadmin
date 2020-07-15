import { expect } from 'chai';
import sinon from 'sinon';
import * as admin from 'firebase-admin'

describe('Cloud Functions', () => {
  let myFunctions
  let adminInitStub

  before(() => {
    /* eslint-disable global-require */
    adminInitStub = sinon.stub(admin, 'initializeApp')
    myFunctions = require(`${__dirname}/../../index`)
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods
    adminInitStub.restore()
  })

  it('exports an object', () => {
    expect(myFunctions).to.be.an('object')
  })
})
