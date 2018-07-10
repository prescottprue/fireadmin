describe('Home', function() {
  it('Logs In', function() {
    cy.visit('http://localhost:3000')
    cy.get('[data-test=sign-in]').click()
    cy.pause()
    cy.get('[data-test=google-auth-button]').click()
    cy.contains('#identifierId')
  })
})
