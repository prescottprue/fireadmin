import { createSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'

describe('Project - Events Page', () => {
  // Setup before tests including creating a server to listen for external requests
  before(() => {
    // Add a fake project owned by the test user
    cy.callFirestore('set', 'projects/test-project', fakeProject, {
      withMeta: true
    })
    // Login using custom token
    cy.login()
  })

  beforeEach(() => {
    // Go to events page
    cy.visit('projects/test-project/events')
  })

  after(() => {
    // Remove fake project and subcollections
    cy.callFirestore('delete', 'projects/test-project', { recursive: true })
  })

  describe('Events List -', () => {
    describe('when there are events', () => {
      it('shows a "no existing events" message', () => {
        cy.get(createSelector('no-project-events')).should('exist')
      })
    })

    describe('when there are events', () => {
      // Setup before tests including creating a server to listen for external requests
      const mostRecentDate = '1/15/2019'
      before(() => {
        // Add fake events
        const event1 = {
          createdAt: new Date('1/1/2018')
        }
        const event2 = {
          createdAt: new Date('4/4/2018')
        }
        const event3 = {
          createdAt: new Date(mostRecentDate)
        }
        cy.addProjectEvent('test-project', 'event1', event1)
        cy.addProjectEvent('test-project', 'event2', event2)
        cy.addProjectEvent('test-project', 'event3', event3)
      })

      it('displays a sorted (most recent first) list of all events', () => {
        cy.get(createSelector('project-events')).should('exist')
        cy.get(createSelector('event-row')).first()
      })

      it('seperates events into groups by date', () => {
        cy.get(createSelector('event-date-divider')).should('exist')
        cy.get(createSelector('event-date-divider-value')).should(
          'equal',
          mostRecentDate
        )
      })

      it('formats event createdAt time into a human readable time', () => {
        cy.get(createSelector('event-createdAt')).should('exist')
      })
    })
  })
})
