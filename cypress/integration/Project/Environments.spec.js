import { createSelector } from '../../utils'

describe('Project - Environments', () => {
  let open // eslint-disable-line no-unused-vars
  // Setup before tests including creating a server to listen for external requests
  beforeEach(() => {
    // Go to home page
    cy.exec('babel-node ./build/ci/addData')
      .its('stdout')
      .should('contain', 'Add Successful')
    // Login using custom token
    cy.login()
    // Go to projects page
    cy.visit('projects/test-project')
  })

  afterEach(() => {
    // Remove project
    cy.exec('npx firebase firestore delete -r -y projects/test-project')
  })

  describe('Add Environment', () => {
    // TODO: Unskip once selectors work
    it.skip('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-environment-button')).click()
      // Type name of new project into input
      cy.get(createSelector('new-environment-name'))
        .find('input')
        .type(newProjectTitle)
      // Click on the new environment button
      cy.get(createSelector('new-environment-create-button')).click()
      // Wait for request to Firebase to add environment to return
      cy.wait('@addEnvironment')
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', newProjectTitle)
    })
  })

  describe('Delete Environment', () => {
    it.skip('allows environment to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('environment-tile-more'))
        .first()
        .click()
      cy.get(createSelector('environment-tile-delete')).click()
      // Confirm that new project is not available
      cy.get(createSelector('new-project-name')).should('not.exist')
    })
  })
})
