import { createSelector } from '../utils'

describe('Projects Page', () => {
  let open // eslint-disable-line no-unused-vars
  // Setup before tests including creating a server to listen for external requests
  beforeEach(() => {
    // Create a server to listen to requests sent out to Google Auth and Firestore
    cy.server()
      // Firebase JS SDK request - Called when project data is written
      .route('POST', /google.firestore.v1beta1.Firestore\/Write/)
      .as('addProject')
      .window()
      .then(win => {
        // Create a spy on the servers onOpen event so we can later expect
        // it to be called with specific arguments
        open = cy.spy(cy.state('server').options, 'onOpen')
        return null
      })
    // Go to home page
    cy.visit('/')
    // Login using custom token
    cy.login()
    // Go to projects page
    cy.visit('/projects')
  })

  describe('Add Project', () => {
    it('creates project when provided a valid name', () => {
      const newProjectTitle = 'Test project'
      cy.get(createSelector('new-project-tile')).click()
      // Type name of new project into input
      cy.get(createSelector('new-project-name'))
        .find('input')
        .type(newProjectTitle)
      // Click on the new project button
      cy.get(createSelector('new-project-create-button')).click()
      // Wait for request to Firebase to add project to return
      cy.wait('@addProject')
      // Confirm first project tile has title passed to new project input
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('have.text', newProjectTitle)
    })
  })

  describe('Delete Project', () => {
    it('allows project to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('project-tile-more'))
        .first()
        .click()
      cy.get(createSelector('project-tile-delete')).click()
      // Confirm that new project is not available
      cy.get(createSelector('new-project-name')).should('not.exist')
    })
  })
})
