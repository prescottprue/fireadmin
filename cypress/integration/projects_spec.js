import { createSelector } from '../utils'

describe('Projects Page', () => {
  before(() => {
    cy.login()
    cy.wait(2000)
    cy.visit('/projects')
    cy.wait(2000)
  })

  describe('Add Project', () => {
    it('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile'), { timeout: 3000 }).click()
      cy.get(createSelector('new-project-name'), { timeout: 2000 })
        .find('input')
        .type(newProjectTitle)
      cy.get(createSelector('new-project-create-button')).click()
      // confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'), { timeout: 3000 })
        .first()
        .should('have.text', newProjectTitle)
    })
  })

  describe('Delete Project', () => {
    it('allows project to be deleted for project owner', () => {
      cy.get(createSelector('project-tile-more'), { timeout: 3000 })
        .first()
        .click()
      cy.get(createSelector('project-tile-delete')).click()
    })
  })
})
