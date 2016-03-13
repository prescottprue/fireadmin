/* global describe it expect */

import Fireadmin from '../../src'
const testFbUrl = 'http://test.firebaseio.com'
const fa = new Fireadmin(testFbUrl)

describe('Fireadmin', () => {
  it('exists', () => {
    expect(Fireadmin).to.exist
  })
  describe('Constructor', () => {
    it('sets correct app name', () => {
      expect(fa.name).to.equal('test')
    })
  })
})
