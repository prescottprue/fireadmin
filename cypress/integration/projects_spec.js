describe('Projects Page', () => {
  beforeEach(() => {
    cy.login()
    cy.visit('/projects')
  })

  it('Logs in programatically', () => {
    cy.url().should('include', '/projects')
  })

  it('Supports adding a new project', () => {
    cy.get('[data-test=new-project-tile]').click()
  })
})
