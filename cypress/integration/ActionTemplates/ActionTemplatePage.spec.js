import { createSelector } from '../../utils'

const testPublicTemplateId = 'testtemplate'
const testPublicTemplate = {
  name: 'test public template',
  description: 'template description',
  createdBy: Cypress.env('TEST_UID'),
  public: true,
  environments: [
    {
      name: 'Source',
      required: true
    },
    {
      name: 'Dest',
      required: true
    }
  ],
  inputs: [
    {
      name: 'Path',
      required: true
    }
  ],
  steps: [
    {
      type: 'copy',
      disableBatching: true,
      name: 'Copy User Path',
      dest: {
        path: 0,
        pathType: 'input',
        resource: 'rtdb'
      },
      src: {
        path: 0,
        pathType: 'input',
        resource: 'rtdb'
      }
    }
  ]
}
const ACTION_TEMPLATES_COLLECTION = 'actionTemplates'
const ACTION_TEMPLATES_ROUTE = '/action-templates'

describe('Action Template Page', () => {
  before(() => {
    cy.login()
    cy.callFirestore(
      'set',
      `${ACTION_TEMPLATES_COLLECTION}/${testPublicTemplateId}`,
      testPublicTemplate
    )
    cy.visit(`${ACTION_TEMPLATES_ROUTE}/${testPublicTemplateId}`)
  })

  it('Shows action template info', () => {
    // TODO: Look into a way to check value of inputs since value is ''
    cy.get(createSelector('template-name')).should(
      'have.attr',
      'value'
      // testPublicTemplate.name
    )
    cy.get(createSelector('template-description')).should(
      'have.attr',
      'value'
      // testPublicTemplate.description
    )
    cy.get(createSelector('action-template-input')).should('have.length', 1)
    cy.get(createSelector('action-template-env')).should('have.length', 2)
    cy.get(createSelector('action-template-step')).should('have.length', 1)
  })

  it('Allows owner to delete template', () => {
    cy.get(createSelector('start-template-delete')).click()
    cy.get(createSelector('submit-template-delete')).click()
    cy.waitUntil(() =>
      cy
        .callFirestore(
          'get',
          `${ACTION_TEMPLATES_COLLECTION}/${testPublicTemplateId}`
        )
        .then((projectTemplate) => projectTemplate === null)
    )
    // Removes data from Firestore
    cy.callFirestore(
      'get',
      `${ACTION_TEMPLATES_COLLECTION}/${testPublicTemplateId}`
    ).then((projectTemplate) => {
      expect(projectTemplate).to.be.null
    })
    // Redirects to action templates list view
    cy.url().should('include', '/action-templates')
  })
})
