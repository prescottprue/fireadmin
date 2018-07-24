import { createSelector } from '../utils'

describe('Projects Page', () => {
  before(() => {
    cy.visit('/')
    cy.login()
    cy.wait(1000)
    cy.visit('/login')
    cy.wait(2000)
  })

  describe('Add Project', () => {
    it('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile')).click()
      cy.get(createSelector('new-project-name'))
        .find('input')
        .type(newProjectTitle)
      cy.get(createSelector('new-project-create-button')).click()
      // confirm first project tile has title passed to new project input
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
})
