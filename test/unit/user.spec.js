/* global describe it beforeEach nock */
import { user } from '../../src'
import config from '../../src/config.json'

describe('User', () => {
  describe('get', () => {
    beforeEach(() => {
      nock(`${config.root}`)
        .get(`/users/mel`)
        .reply(200, {
          username: 'mel'
        })
    })

    it('gets the user', () =>
      user('mel')
        .get()
        .should.eventually.have.property('username')
    )
  })

  describe('createProject', () => {
    let projectname = 'chamunga'
    let username = 'scott'
    let collaborators = [username]

    beforeEach(() => {
      nock(`${config.root}`)
        .post('/users/mel/projects', {
          name: projectname
        })
        .reply(200, {
          name: projectname
        })
      nock(`${config.root}`)
        .post('/users/mel/projects', {
          name: projectname,
          collaborators
        })
        .reply(200, {
          name: projectname,
          collaborators: [
            {
              username
            }
          ]
        })
    })

    it('creates a project', () =>
      user('mel')
        .createProject(projectname)
        .should.eventually.have.property('name', projectname)
    )

    it('adds collaborators', () =>
      user('mel')
        .createProject(projectname, collaborators)
        .should.eventually.have.deep.property('collaborators[0].username', username)
    )
  })
})
