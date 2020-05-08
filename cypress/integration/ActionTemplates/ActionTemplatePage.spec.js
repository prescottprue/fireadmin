import { createSelector } from '../../utils'

const testPublicTemplateId = 'testtemplate'
const testPublicTemplate = {
  name: 'test public template',
  description: 'template description',
  createdBy: Cypress.env('TEST_UID'),
  public: true
}
const ACTION_TEMPLATES_COLLECTION = 'actionTemplates'
const ACTION_TEMPLATES_ROUTE = '/action-templates'

describe('Action Template Page', () => {
  before(() => {
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
  })
  // TODO: Add a tests for sections of template including inputs, environments, and backups
})
