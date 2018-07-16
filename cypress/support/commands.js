import { getAuthToken } from '../utils'

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
  if (!Cypress.env('TEST_UID') || !Cypress.env('TEST_PASSWORD')) {
    cy.log('TEST_UID and TEST_PASSWORD are required environment variables')
    return
  }
  return getAuthToken().then(token => {
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
  })
})
//
//
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
