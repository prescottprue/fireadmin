import * as admin from 'firebase-admin'

describe('Cloud Functions', () => {
  let myFunctions
  let adminInitStub
  // let admin

  before(() => {
    /* eslint-disable global-require */
    // admin = require('firebase-admin')
    adminInitStub = sinon.stub(admin, 'initializeApp')
    myFunctions = require(`${__dirname}/../../index`)
    /* eslint-enable global-require */
  })

  after(() => {
    // Restoring our stubs to the original methods.
    adminInitStub.restore()
  })

  it('exports an object', () => {
    expect(myFunctions).to.be.an('object')
  })
})
