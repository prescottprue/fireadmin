import { createSelector } from '../../utils'
const actionRunScriptPath = 'build/ci/addData.js'

describe('Project - Environments', () => {
  let open // eslint-disable-line no-unused-vars
  // Setup before tests including creating a server to listen for external requests
  beforeEach(() => {
    cy.server()
      // Firebase JS SDK request - Called when project data is written
      .route('POST', /google.firestore.v1beta1.Firestore\/Listen/)
      .as('listenForProjects')
      .window()
      .then(win => {
        // Create a spy on the servers onOpen event so we can later expect
        // it to be called with specific arguments
        open = cy.spy(cy.state('server').options, 'onOpen')
        return null
      })
    cy.exec(`${actionRunScriptPath} firestore set projects/test-project`)
    // Go to home page
    // Login using custom token
    cy.login()
    // Go to projects page
    cy.visit('projects/test-project/environments')
    cy.wait('@listenForProjects')
  })

  after(() => {
    // Remove project
    // cy.exec(`${actionRunScriptPath} firestore delete projects/test-project`)
  })

  describe('Add Environment', () => {
    // TODO: Unskip once selectors work
    it('creates environment when provided a valid name', () => {
      const newProjectTitle = 'Staging'
      cy.get(createSelector('add-environment-button')).click()
      // Type name of new project into input
      cy.get(createSelector('new-environment-name'))
        .find('input')
        .type(newProjectTitle)
      cy.get(createSelector('new-environment-name'))
        .find('input')
        .type(`https://some-project.firebaseio.com`)
      // Click on the new environment button
      cy.get(createSelector('file-uploader')).click()
      // TODO: Upload service-account file
      cy.get(createSelector('new-environment-create-button')).click()
    })
  })

  describe('Delete Environment', () => {
    it.skip('allows environment to be deleted by project owner', () => {
      // click on the more button
      cy.get(createSelector('environment-tile-more'))
        .first()
        .click()
      cy.get(createSelector('environment-delete-submit')).click()
      // Confirm that new project is not available
      cy.get(createSelector('project-tile-name'))
        .first()
        .should('not.exist')
    })
  })
})
