import { find } from 'lodash'
import { createSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'

describe('Project - Environments Page', () => {
  let openSpy // eslint-disable-line no-unused-vars
  // Setup before tests including creating a server to listen for external requests
  before(() => {
    // Add a fake project owned by the test user
    cy.callFirestore('set', 'projects/test-project', fakeProject, {
      withMeta: true
    })
    // Login using custom token
    cy.login()
  })

  beforeEach(() => {
    // Go to environments page
    cy.visit('projects/test-project/environments')
  })

  after(() => {
    // Remove fake project and subcollections
    cy.callFirestore('delete', 'projects/test-project', { recursive: true })
  })

  describe('Add Environment - ', () => {
    after(() => {
      // Remove created environment
      cy.callFirestore('delete', 'projects/test-project/environments', {
        recursive: true
      })
    })

    it('creates environment when provided a valid name', () => {
      const newProjectName = 'Staging'
      cy.get(createSelector('add-environment-button')).click()
      // Type name of new project into input
      cy.get(createSelector('new-environment-name'))
        .find('input')
        .type(newProjectName, { delay: 0 })

      // Type in new environment url
      cy.get(createSelector('new-environment-db-url'))
        .find('input')
        .type(`https://some-project.firebaseio.com`, { delay: 0 })

      // Upload service account
      cy.uploadFile(
        createSelector('file-uploader-input'),
        'fakeServiceAccount.json'
      )

      // Click on the new environment button
      cy.get(createSelector('new-environment-create-button')).click()
      // Confirm user is notified of successful environment creation
      cy.get(createSelector('notification-message')).should(
        'contain',
        'Environment added successfully'
      )
      // Verify new environment was added to Firestore with correct data
      cy.callFirestore('get', 'projects/test-project/environments').then(
        (environments) => {
          expect(environments).to.be.an('array')
          const matchingEnv = find(environments, { name: newProjectName })
          expect(matchingEnv).to.exist
        }
      )
    })
  })

  describe('Delete Environment -', () => {
    const newEnvName = 'test-env'
    beforeEach(() => {
      // Remove created environment
      cy.callFirestore('delete', 'projects/test-project/environments', {
        recursive: true
      })
      cy.addProjectEnvironment('test-project', newEnvName)
    })

    it('allows environment to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('environment-test-env'))
        .find(createSelector('environment-tile-more'))
        .click()
      // click delete option
      cy.get(createSelector('delete-environment-button')).click()
      // Hit submit in confirm modal
      cy.get(createSelector('environment-delete-submit')).click()
      // Confirm that deleted environment is no longer available in UI
      cy.get(createSelector('project-tile-name')).should('not.exist')
      // Confirm user is notified of successful deletion
      cy.get(createSelector('notification-message')).should(
        'contain',
        'Environment deleted successfully'
      )
      // Confirm that deleted environment is no longer within Firestore
      cy.callFirestore('get', 'projects/test-project/environments').then(
        (environments) => {
          expect(environments).to.be.null
        }
      )
    })
  })
})
