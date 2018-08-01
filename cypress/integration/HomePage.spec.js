import { createSelector } from '../utils'

describe('Home', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Goes to login page', () => {
    cy.get(createSelector('sign-in')).click()
    cy.get(createSelector('google-auth-button')).should('exist')
  })
})
