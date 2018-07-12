describe('Home', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Goes to login page', () => {
    cy.get('[data-test=sign-in]').click()
    cy.get('[data-test=google-auth-button]').should('exist')
  })
})
