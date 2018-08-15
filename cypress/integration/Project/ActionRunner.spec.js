import { createSelector } from '../../utils'

describe('Project - Action Runner', () => {
  let open // eslint-disable-line no-unused-vars
  // Setup before tests including creating a server to listen for external requests
  beforeEach(() => {
    // const testUid = Cypress.env('TEST_UID')
    cy.exec('babel-node ./build/ci/addData')
    // Go to home page
    cy.visit('/')
    // Login using custom token
    cy.login()
    // TODO: Add a project owned by the test user
    // TODO: Setup util to change attributes of transaction
    // Go to projects page
    cy.visit('/projects/test-project')
  })

  describe('Run Action', () => {
    it.skip('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile')).click()
      // Type name of new project into input
      cy.get(createSelector('new-project-name'))
        .find('input')
        .type(newProjectTitle)
      // Click on the new project button
      cy.get(createSelector('new-project-create-button')).click()
      // Wait for request to Firebase to add project to return
      cy.wait('@addProject')
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', newProjectTitle)
    })
  })
})
