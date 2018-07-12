describe('Projects Page', () => {
  beforeEach(() => {
    window.localStorage.setItem('fbToken', Cypress.env('FIREBASE_TOKEN'))
    cy.visit('/projects')
  })

  it('Supports adding a new project', () => {
    cy.get('.new-project-tile').click()
  })
})
