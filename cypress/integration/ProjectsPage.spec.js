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
    before(() => {
      const fakeProject = {
        name: 'test delete project',
        collaborators: { [Cypress.env('TEST_UID')]: true }
      }
      cy.callFirestore('delete', 'projects')
      cy.callFirestore('set', 'projects/test-delete-project', fakeProject)
    })

    it('allows project to be deleted by project owner', () => {
      // Find tile with matching ID and click on the more button
      cy.get(createIdSelector('test-delete-project'))
        .find(createSelector('project-tile-more'))
        .click()
      cy.get(createSelector('project-tile-delete')).click()
      // Confirm project tile is removed
      cy.get(createIdSelector('test-delete-project')).should('not.exist')
      // Confirm project is removed from DB
      cy.waitUntil(() =>
        cy
          .callFirestore('get', 'projects/test-delete-project')
          .then((deletedProject) => deletedProject === null)
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
    const ownedProject = {
      name: 'owned an collab project',
      createdBy: Cypress.env('TEST_UID'),
      collaborators: { [Cypress.env('TEST_UID')]: true }
    }
    before(() => {
      cy.callFirestore('delete', 'projects')
      cy.callFirestore('set', 'projects/collab-project-1', fakeProject)
      cy.callFirestore('set', 'projects/collab-project-2', fakeProject2)
      cy.callFirestore('set', 'projects/owned-project-1', ownedProject)
    })

    it('shows projects which are created by the current user', () => {
      // Confirm first project tile has title passed to new project input
      cy.get(createIdSelector('owned-project-1')).should('exist')
    })

    it('shows projects which have the user as a collaborator', () => {
      // Confirm first project tile has title passed to new project input
      cy.get(createIdSelector('collab-project-1')).should('exist')
      cy.get(createIdSelector('collab-project-2')).should('exist')
    })

    it('does not display the same project twice (even is creator is also collaborator)', () => {
      cy.get(createSelector('project-tile-name')).its('length').should('be', 3)
    })
  })
})
