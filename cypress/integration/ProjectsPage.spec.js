import { createSelector, createIdSelector } from '../utils'

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
    beforeEach(() => {
      const fakeProject = {
        name: 'test delete project',
        collaborators: { [Cypress.env('TEST_UID')]: true }
      }
      cy.callFirestore('set', 'projects/test-delete-project', fakeProject)
    })

    it('allows project to be deleted by project owner', () => {
      // Find tile with matching ID and click on the more button
      cy.get(createIdSelector('test-delete-project'))
        .find(createSelector('project-tile-more'))
        .click()
      cy.get(createSelector('project-tile-delete')).click()
      // Confirm project is removed
      cy.callFirestore('get', 'projects/test-delete-project').then(
        deletedProject => {
          cy.log('deleted project', deletedProject)
          expect(deletedProject).to.be.null
        }
      )
    })
  })

  describe('List of Projects', () => {
    const fakeProject = {
      name: 'collab project 1',
      collaborators: { [Cypress.env('TEST_UID')]: true }
    }
    const fakeProject2 = {
      name: 'collab project 2',
      collaborators: { [Cypress.env('TEST_UID')]: true }
    }
    before(() => {
      cy.callFirestore('set', 'projects/collab-project-1', fakeProject)
      cy.callFirestore('set', 'projects/collab-project-2', fakeProject2)
    })

    it('shows projects which have the user as a collaborator', () => {
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .its('length')
        .should('be.gte', 2)
    })
  })
})
