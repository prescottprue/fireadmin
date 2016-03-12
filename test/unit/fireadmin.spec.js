import Fireadmin from '../src/fireadmin'
let testFbUrl = 'http://test.firebaseio.com'
let fa = new Fireadmin(testFbUrl)
describe('Fireadmin', () => {
  it('exists', () => {
    expect(Fireadmin).to.exist
  })
  describe('Constructor', () => {
    it('sets correct app name', () => {
      expect(fa.appName).to.equal('test')
    })
  })
  describe('auth()', () => {
    it('is null by default', () => {
      expect(fa.auth).to.equal(null)
    })
  })
  describe('createObject()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('createObject')
    })
  })
  describe('listByCurrentUser()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('listByCurrentUser')
    })
  })
  describe('listByUid()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('listByUid')
    })
  })
  describe('getUserCount()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('getUserCount')
    })
  })
  describe('getOnlineUserCount()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('getOnlineUserCount')
    })
  })
  describe('sessionsBetween()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('sessionsBetween')
    })
  })
  describe('sessionsSince()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('sessionsSince')
    })
  })
  describe('averageSessionLength()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('averageSessionLength')
    })
  })
  describe('removeUserSessions()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('removeUserSessions')
    })
  })
  describe('userSignup()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('userSignup')
    })
  })
  describe('emailAuth()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('emailAuth')
    })
  })
  describe('accountByUid()', () => {
    it('exists', () => {
      expect(fa).to.respondTo('emailAuth')
      fa.accountByUid(1)
    })
  })
})
