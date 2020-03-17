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

  describe('Events List -', () => {
    describe.skip('when there are events', () => {
      it('shows a "no existing events" message', () => {
        cy.get(createSelector('no-project-events')).should('exist')
      })
    })

    describe('when there are events', () => {
      // Setup before tests including creating a server to listen for external requests
      const mostRecentDate = '10/15/19'
      before(() => {
        // Add fake events
        const event1 = {
          createdAt: new Date('01/01/18').toISOString()
        }
        const event2 = {
          createdAt: new Date('04/04/18').toISOString()
        }
        const event3 = {
          createdAt: new Date(mostRecentDate).toISOString()
        }
        cy.addProjectEvent('test-project', 'event1', event1)
        cy.addProjectEvent('test-project', 'event2', event2)
        cy.addProjectEvent('test-project', 'event3', event3)
      })

      it('displays a list of all events', () => {
        cy.get(createSelector('project-events')).should('exist')
      })

      it('seperates events into groups by date (most recent first)', () => {
        cy.get(createSelector('event-date-divider')).should('exist')
        cy.get(createSelector('event-date-divider-value'))
          .first()
          .invoke('text')
          .should('equal', mostRecentDate)
      })

      it('formats event createdAt time into a human readable time', () => {
        cy.get(createSelector('event-createdAt'))
          .first()
          .invoke('text')
          .should('equal', '12:00:00.000 AM') // Since date is provided to Date object
      })
    })
  })
})
