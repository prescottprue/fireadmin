const TOKEN_STORAGE_KEY = 'fbToken'

// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
Cypress.Commands.add('login', (email, password) => {
  if (!Cypress.env('FIREBASE_AUTH_JWT')) {
    cy.log(
      'FIREBASE_AUTH_JWT must be set to cypress environment in order to login'
    )
    return
  }
  cy.log('FIREBASE_AUTH_JWT is defined, setting to session storage...')
  window.sessionStorage.setItem(
    TOKEN_STORAGE_KEY,
    Cypress.env('FIREBASE_AUTH_JWT')
  )
  cy.log('FIREBASE_AUTH_JWT set to session storage, logging in...')
})
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
