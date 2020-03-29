import { createSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'

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

    after(() => {
      // Remove environment after
      cy.callFirestore(
        'delete',
        `projects/test-project/environments/${lockedEnvId}`
      )
    })

    it('locked env is disabled as a source', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result')).first().click()
      // Open source select field
      cy.get(createSelector('environment-select')).first().click()
      // Config that locked-env is disabled
      cy.get(createSelector(`environment-option-${lockedEnvId}`)).should(
        'have.css',
        'pointer-events',
        'none'
      )
    })

    it('locked env is disabled as destination', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result')).first().click()
      // Open destination select field
      cy.get(createSelector('environment-select')).last().click()
      // Pick first option for the destination environment
      // Confirm that locked-env is disabled is disabled
      cy.get(createSelector(`environment-option-${lockedEnvId}`)).should(
        'have.css',
        'pointer-events',
        'none'
      )
    })
  })

  describe('Environment with "Read Only" option', () => {
    const srcId = 'src-only'
    before(() => {
      const lockedEnv = { name: 'only src env', readOnly: true }
      cy.addProjectEnvironment('test-project', srcId, lockedEnv)
    })

    after(() => {
      // Remove environments (made in before)
      cy.callFirestore('delete', 'projects/test-project/environments')
    })

    it('disables run action button if "Read Only" environment is selected as a destination', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result')).first().click()
      // Open dest select field
      cy.get(createSelector('environment-select'))
        .last()
        .scrollIntoView()
        .click()
      // Confirm that Source Only environment can not be selected as destination
      cy.get(createSelector(`environment-option-${srcId}`)).should(
        'have.css',
        'pointer-events',
        'none'
      )
    })
  })

  describe('Environment with "Write Only" option', () => {
    const destId = 'dest-only'
    before(() => {
      const lockedEnv = { name: 'only dest env', writeOnly: true }
      cy.addProjectEnvironment('test-project', destId, lockedEnv)
    })

    after(() => {
      // Remove environments (made in before)
      cy.callFirestore('delete', 'projects/test-project/environments')
    })

    it('disables run action button if "Write Only" environment is selected as a source', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input').type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result')).first().click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .first()
        .scrollIntoView()
        .click()
      // Confirm that Destination Only environment can not be selected as source
      cy.get(createSelector(`environment-option-${destId}`)).should(
        'have.css',
        'pointer-events',
        'none'
      )
    })
  })

  // Skipped since request object is too large
  // TODO: Re-enable once action runner does not require whole template to be written to request
  describe.skip('Running Action', () => {
    const srcId = 'src-env'
    const destId = 'dest-env'

    before(() => {
      cy.addProjectEnvironment('test-project', srcId, { name: 'source env' })
      cy.addProjectEnvironment('test-project', destId, {
        name: 'dest env'
      })
    })

    after(() => {
      // Remove environments (made in before)
      cy.callFirestore('delete', 'projects/test-project/environments')
    })

    it('requests valid action run provided valid inputs', () => {
      // Search for an action template
      cy.get('.ais-SearchBox__input')
        .scrollIntoView()
        .type('Copy Firestore Collection')
      // Select the first action template
      cy.get(createSelector('search-result')).first().scrollIntoView().click()
      // Open source select field
      cy.get(createSelector('environment-select')).first().click()
      // Pick the src env
      cy.get(createSelector(`environment-option-${srcId}`)).click()
      // Click away
      cy.get('body').click()
      // Open destination select field
      cy.get(createSelector('environment-select'))
        .last()
        .scrollIntoView()
        .click()
      // Pick the dest env
      cy.get(createSelector(`environment-option-${destId}`)).click()
      // Fill out the input (which collection to copy)
      cy.get(createSelector('action-input')).first().type('test')
      // Click run action button to start action run
      cy.get(createSelector('run-action-button'))
        .scrollIntoView()
        .should('not.be.disabled') // confirm button is not disabled before attempting to click
        .click()
      // Confirm request was created with correct settings
      cy.callRtdb('get', 'requests/actionRunner', {
        orderByChild: 'createdAt',
        limitToLast: 1,
        shallow: true
      }).then((requests) => {
        cy.log('requests:', requests)
        cy.wrap(requests[Object.keys(requests)[0]])
          .its('createdBy')
          .should('equal', Cypress.env('TEST_UID'))
      })
    })
  })
})
