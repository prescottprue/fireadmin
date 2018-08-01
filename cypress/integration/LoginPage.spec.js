import { createSelector } from '../utils'

describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('Signup link brings user to signup page', () => {
    cy.get(createSelector('sign-up-link')).click()
    cy.url().should('include', '/signup')
  })

  it('Shows Login Through Google Button', () => {
    cy.url().should('include', '/login')
    cy.get(createSelector('google-auth-button')).click()
  })
})
