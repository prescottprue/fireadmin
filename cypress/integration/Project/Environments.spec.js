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
    // TODO: Unskip once file drag-drop uploading is figured out through cypress
    // Error: Error: Failed to execute 'atob' on 'Window': The string to be decoded is not correctly encoded.
    it.skip('creates environment when provided a valid name', () => {
      const newProjectTitle = 'Staging'
      cy.get(createSelector('add-environment-button')).click()
      // Type name of new project into input
      cy.get(createSelector('new-environment-name'))
        .find('input')
        .type(newProjectTitle)
      // Type in new environment url
      cy.get(createSelector('new-environment-db-url'))
        .find('input')
        .type(`https://some-project.firebaseio.com`)
      // Upload service account
      cy.uploadFile(createSelector('file-uploader'), 'fakeServiceAccount.json')
      // Click on the new environment button
      cy.get(createSelector('new-environment-create-button')).click()
      cy.wait(4000)
    })
  })

  describe('Delete Environment -', () => {
    it.skip('allows environment to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('environment-tile-more'))
        .first()
        .click()
      cy.get(createSelector('environment-delete-submit')).click()
      // Confirm that new project is not available
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('not.exist')
    })
  })
})
