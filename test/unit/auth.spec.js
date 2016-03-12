/* global describe it expect beforeEach nock */
import * as auth from '../../src/auth'
import cookie from 'cookie'
import config from '../../src/config.json'

describe('Auth', () => {
  const username = 'crazyDude'
  const password = 'twinkletoes'
  const email = 'cdude@twinkler.com'
  const name = 'David Smiggles'
  const token = '2k2kj9d92jd9uby3'

  describe('login', () => {
    beforeEach(() => {
      nock(`${config.root}`)
        .put(`/login`, { username, password })
        .reply(200, {
          user: {
            username, email, name
          },
          token
        })
    })

    it('calls endpoint', () =>
      auth
        .login(username, password)
        .should.eventually.have.deep.property('user.username', username)
    )

    it('saves the token', () =>
      auth
        .login(username, password)
        .should.be.fulfilled
        .then(_ => {
          return cookie.parse(document.cookie).should.have.property('token', token)
        })
    )

    it('saves the current user', () =>
      auth
        .login(username, password)
        .should.be.fulfilled
        .then(_ => {
          return JSON.parse(window.sessionStorage.getItem('currentUser')).should.have.property('username', username)
        })
    )
  })

  describe('logout', () => {
    beforeEach(() => {
      nock(`${config.root}`)
        .put(`/logout`)
        .reply(200, {
          message: 'logout successful'
        })
    })

    it('calls endpoint', () =>
      auth
        .logout()
        .should.eventually.have.property('message', 'logout successful')
    )

    it('clears token from cookie', () =>
      auth
        .logout()
        .should.be.fulfilled
        .then(_ => {
          return document.cookie.should.be.empty
        })
    )

    it('removes current user from session storage', () =>
      auth
        .logout()
        .should.be.fulfilled
        .then(_ => {
          return expect(window.sessionStorage.getItem('currentUser')).to.be.null
        })
    )
  })

  describe('signup', () => {
    beforeEach(() => {
      nock(`${config.root}`)
        .post(`/signup`, { username, password, name, email })
        .reply(200, {
          user: {
            username, email, name
          },
          token
        })
    })

    it('calls endpoint', () =>
      auth
        .signup({ username, password, name, email })
        .should.eventually.have.deep.property('user.username', username)
    )

    it('saves the token', () =>
      auth
        .signup({ username, password, name, email })
        .should.be.fulfilled
        .then(_ => {
          return cookie.parse(document.cookie).should.have.property('token', token)
        })
    )

    it('saves the current user', () =>
      auth
        .signup({ username, password, name, email })
        .should.be.fulfilled
        .then(_ => {
          return JSON.parse(window.sessionStorage.getItem('currentUser')).should.have.property('username', username)
        })
    )
  })
})
