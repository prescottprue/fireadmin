import { createSelector, createIdSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'
const destEnvName = 'dest env'

describe('Project - Actions Page', () => {
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
    const lockedEnvId = 'locked-env'
    const lockedEnv = { name: 'locked env', locked: true }
    before(() => {
      cy.addProjectEnvironment('test-project', lockedEnvId, lockedEnv)
    })

    it('is disabled as both a source and destination', () => {
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
      // Config that locked-env is disabled
      cy.get(createIdSelector('locked-env'))
        .invoke('attr', 'class')
        .should('contain', 'disabled')
      // Click away
      cy.get('body').click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .last()
        .click()
      // Pick first option for the destination environment
      // Confirm that locked-env is disabled is disabled
      cy.get(createIdSelector('locked-env'))
        .invoke('attr', 'class')
        .should('contain', 'disabled')
    })
  })

  describe('Environment with "Read Only" option', () => {
    before(() => {
      const lockedEnv = { name: 'only src env', readOnly: true }
      cy.addProjectEnvironment('test-project', 'src-only', lockedEnv)
    })

    it('disables run action button if "Read Only" environment is selected as a destination', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result'))
        .first()
        .click()
      // Open dest select field
      cy.get(createSelector('environment-select'))
        .last()
        .scrollIntoView()
        .click()
      // Confirm that Source Only environment can not be selected as destination
      cy.get(createIdSelector('src-only'))
        .invoke('attr', 'class')
        .should('contain', 'disabled')
    })
  })

  describe('Environment with "Write Only" option', () => {
    before(() => {
      const lockedEnv = { name: 'only dest env', writeOnly: true }
      cy.addProjectEnvironment('test-project', 'dest-only', lockedEnv)
    })

    it('disables run action button if "Write Only" environment is selected as a source', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result'))
        .first()
        .click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .first()
        .scrollIntoView()
        .click()
      // Confirm that Destination Only environment can not be selected as source
      cy.get(createIdSelector('dest-only'))
        .invoke('attr', 'class')
        .should('contain', 'disabled')
    })
  })

  describe('Running Action', () => {
    before(() => {
      cy.addProjectEnvironment('test-project', 'src-env', { name: '' })
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
      // Pick the src env
      cy.get(createSelector('environment-option'))
        .first()
        .click()
      // Click away
      cy.get('body').click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .last()
        .scrollIntoView()
        .click()
      // Pick the src env
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
