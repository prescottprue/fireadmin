import { createSelector } from '../utils'

describe('Projects Page', () => {
  beforeEach(() => {
    // Login using custom token
    cy.login()
    // Go to projects page
    cy.visit('/projects')
  })

  describe('Add Project', () => {
    it('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile')).click()
      // Type name of new project into input
      cy.get(createSelector('new-project-name'))
        .find('input')
        .type(newProjectTitle)
      // Click on the new project button
      cy.get(createSelector('new-project-create-button')).click()
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', newProjectTitle)
    })
  })

  describe('Delete Project', () => {
    it('allows project to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('project-tile-more'))
        .first()
        .click()
      cy.get(createSelector('project-tile-delete')).click()
      // Confirm that new project is not available
      cy.get(createSelector('new-project-name')).should('not.exist')
    })
  })

  describe('List of Projects', () => {
    const collabProjectName = 'collab project'
    before(() => {
      const fakeProject = {
        name: collabProjectName,
        collaborators: { [Cypress.env('TEST_UID')]: true }
      }
      cy.callFirestore('set', 'projects/test-project', fakeProject)
    })

    after(() => {
      cy.callFirestore('delete', 'projects/test-project')
    })

    it.only('shows projects which have the user as a collaborator', () => {
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', collabProjectName)
    })
  })
})
