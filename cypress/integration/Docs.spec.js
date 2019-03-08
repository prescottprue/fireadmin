import { createSelector } from '../utils'

describe('Docs', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Link to docs exists in Navbar of homepage', () => {
    cy.get(createSelector('docs-desktop-button')).should('exist')
  })
})
