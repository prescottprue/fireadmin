import { createSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'
const destEnvName = 'dest env'

describe('Project - Action Runner', () => {
  // Setup before tests including creating a fake project
  before(() => {
    // Add a fake project owned by the test user
    cy.callFirestore('set', 'projects/test-project', fakeProject, {
      withMeta: true
    })
    // Login using custom token
    cy.login()
    // Go to fake project page actions page
    cy.visit('/projects/test-project/actions')
  })

  beforeEach(() => {
    // Reload using cache to clear action runner component state
    cy.reload(false)
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

  describe('Environment Locking', () => {
    before(() => {
      const lockedEnv = { name: 'locked env', locked: true }
      cy.addProjectEnvironment('test-project', 'locked-env', lockedEnv)
    })

    it('disables run action button if locked environment is selected', () => {
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
      // Click away
      cy.get('body').click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .last()
        .click()
      // Pick first option for the destination environment
      // TODO: Select actual environment instead of just last one
      cy.get(createSelector('environment-option'))
        .last()
        .click()
      // Fill out the input (which collection to copy)
      cy.get(createSelector('action-input'))
        .first()
        .type('test')
      cy.get(createSelector('run-action-button')).should('be.disabled')
    })
  })

  describe('Running Action', () => {
    before(() => {
      cy.addProjectEnvironment('test-project', 'src-env')
      cy.addProjectEnvironment('test-project', 'dest-env', {
        name: destEnvName
      })
    })

    it('requests valid action run provided valid inputs', () => {
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
      // Click away
      cy.get('body').click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .last()
        .click()
      // Pick first option for the destination environment
      cy.get(createSelector('environment-option'))
        .last()
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
        limitToLast: 1
      }).then(requests => {
        cy.log('request:', requests)
        // Confirm new data has users uid
        cy.wrap(requests[Object.keys(requests)[0]])
          .its('createdBy')
          .should('equal', Cypress.env('TEST_UID'))
      })
    })
  })
})
