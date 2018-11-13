import { createSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'
import fakeEnvironment from '../../fixtures/fakeEnvironment.json'

describe('Project - Action Runner', () => {
  // Setup before tests including creating a fake project
  before(() => {
    // Add a fake project owned by the test user
    cy.callFirestore('set', 'projects/test-project', fakeProject, {
      withMeta: true
    })
    cy.callFirestore(
      'set',
      'projects/test-project/src-env/abc',
      fakeEnvironment
    )
    // TODO: Add fake environment
    cy.callFirestore(
      'set',
      'projects/test-project/dest-env/bcd',
      fakeEnvironment
    )
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

  describe('Initial Load', () => {
    it('Run Action Button is disabled', () => {
      cy.get(createSelector('run-action-button')).should('be.disabled')
    })
  })

  describe('Run Action', () => {
    it.only('runs action if using non-disabled environment', () => {
      cy.callRtdb('get', 'requests/actionRunner', {
        args: ['--limit-to-first 1']
      }).then(request => {
        console.log('request:', request)
        // Confirm new data has users uid
        cy.wrap(request)
          .its('createdBy')
          .should('equal', Cypress.env('TEST_UID'))
      })
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result'))
        .first()
        .click()
      // Open source select field
      cy.get(createSelector('environment-select'))
        .first()
        .click()
      // Pick first option for the src environment
      cy.get(createSelector('environment-option'))
        .first()
        .click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .first()
        .click()
      // Pick first option for the destination environment
      cy.get(createSelector('environment-option'))
        .first()
        .click()
      // Fill out the input (which collection to copy)
      cy.get(createSelector('action-input'))
        .first()
        .type('test')
      // Click run action button to start action run
      cy.get(createSelector('run-action-button'))
        .should('not.be.disabled') // confirm button is not disabled before attempting to click
        .click()
      // Confirm request was created with correct settings
      cy.callRtdb('get', 'requests/actionRunner', {
        args: ['--limit-to-first 1']
      }).then(request => {
        console.log('request:', request)
        // Confirm new data has users uid
        cy.wrap(request)
          .its('createdBy')
          .should('equal', Cypress.env('TEST_UID'))
      })
    })

    it.skip('is disabled if protected environment is selected', () => {
      // TODO: Add an environment which has protected: true
      // TODO: Confirm that Run Action button is disabled
      cy.get(createSelector('run-action-button')).should('be.disabled')
    })
  })
})
