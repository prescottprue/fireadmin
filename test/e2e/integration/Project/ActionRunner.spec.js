import { createSelector } from '../../utils'

describe('Project - Action Runner', () => {
  // Setup before tests including creating a fake project
  before(() => {
    // Add a fake project owned by the test user
    cy.callFirestore('set', 'projects/test-project', 'fakeProject.json', {
      withMeta: true
    })
    // Login using custom token
    cy.login()
  })

  beforeEach(() => {
    // Go to fake project page actions page
    cy.visit('/projects/test-project/actions')
  })

  after(() => {
    // Remove project and subcollections
    cy.callFirestore('delete', 'projects/test-project', { recursive: true })
  })

  describe('Run Action', () => {
    it('runs action if using non-disabled environment', () => {
      cy.get(createSelector('run-action-button')).should('be.disabled')
    })

    it.skip('is disabled if protected environment is selected', () => {
      // TODO: Add an environment which has protected: true
      // TODO: Confirm that Run Action button is disabled
      cy.get(createSelector('run-action-button')).should('be.disabled')
    })
  })
})
