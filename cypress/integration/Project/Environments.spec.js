import { createSelector } from '../../utils'
const actionRunScriptPath = 'build/ci/addData.js'

describe('Project - Environments', () => {
  let open // eslint-disable-line no-unused-vars
  // Setup before tests including creating a server to listen for external requests
  beforeEach(() => {
    cy.server({
      whitelist: xhr => xhr.url.includes('identitytoolkit')
    })
      // Firebase JS SDK request - Called when project data is written
      .route('POST', /google.firestore.v1beta1.Firestore\/Listen/)
      .as('listenForProjects')
      .window()
      .then(win => {
        // Create a spy on the servers onOpen event so we can later expect
        // it to be called with specific arguments
        open = cy.spy(cy.state('server').options, 'onOpen')
        // window.___INITIAL_STATE__ = {
        //   firebase: { authError: null },
        //   firestore: {
        //     data: { projects: { 'test-project': { name: 'test-project' } } },
        //     ordered: {
        //       projects: [{ id: 'test-project', name: 'test-project' }]
        //     }
        //   }
        // }
        return null
      })
    // Go to home page
    // Login using custom token
    cy.exec(`${actionRunScriptPath} firestore set projects/test-project`)
    cy.login()
    // cy.visit('projects')
    // Go to projects page
    cy.visit('projects/test-project/environments')
    // cy.wait(6000)
    cy.wait('@listenForProjects')
  })

  after(() => {
    // Remove project
    // cy.exec(`${actionRunScriptPath} firestore delete projects/test-project`)
  })

  describe('Add Environment', () => {
    // TODO: Unskip once solved issue:
    // "Firebase Storage: Invalid argument in `put` at index 0: Expected Blob or File."
    it('creates environment when provided a valid name', () => {
      const newProjectTitle = 'Staging'
      cy.get(createSelector('add-environment-button')).click()
      // Type name of new project into input
      cy.get(createSelector('new-environment-name'))
        .find('input')
        .type(newProjectTitle)
      cy.get(createSelector('new-environment-db-url'))
        .find('input')
        .type(`https://some-project.firebaseio.com`)
      // Click on the new environment button
      cy.upload_file(
        createSelector('file-uploader'),
        'fakeServiceAccount.json',
        'application/json'
      )
      // force: true used since drop area is under title (i.e. "hidden")
      // cy.get(createSelector('file-uploader')).trigger('drop', dropEvent)
      cy.wait(4000)
      cy.pause()
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