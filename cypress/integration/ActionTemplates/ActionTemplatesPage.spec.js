import firebase from 'firebase/app'
import 'firebase/firestore'
import { createSelector } from '../../utils'

const testPublicTemplateId = 'testtemplate'
const testPublicTemplate = {
  name: 'test public template',
  createdBy: 'ABC123',
  createdAt: firebase.firestore.Timestamp.now(),
  public: true
}
const ACTION_TEMPLATES_COLLECTION = 'actionTemplates'
const ACTION_TEMPLATES_ROUTE = '/action-templates'

describe('Actions Template Page', () => {
  before(() => {
    cy.visit(ACTION_TEMPLATES_ROUTE)
    cy.callFirestore(
      'set',
      `${ACTION_TEMPLATES_COLLECTION}/${testPublicTemplateId}`,
      testPublicTemplate
    )
  })

  describe('When Not Authenticated', () => {
    it('Shows public templates', () => {
      cy.get(createSelector('action-template-card-public')).should(
        'have.length.gte',
        1
      )
      cy.get(
        createSelector(`action-template-title-${testPublicTemplateId}`)
      ).should('have.text', testPublicTemplate.name)
    })

    it('Template cards link to template detail page', () => {
      cy.get(
        createSelector(`action-template-title-${testPublicTemplateId}`)
      ).should(
        'have.attr',
        'href',
        `${ACTION_TEMPLATES_ROUTE}/${testPublicTemplateId}`
      )
    })
    // Skipped because clicking away was not working as expected in CI
    it('Disables actions for users who are not the author of the template', () => {
      cy.get(createSelector('action-template-card-public-actions')).click()
      // Confirm that edit and remove options are disabled
      cy.get(createSelector('action-template-edit')).should(
        'have.css',
        'pointer-events',
        'none'
      )
      cy.get(createSelector('action-template-delete')).should(
        'have.css',
        'pointer-events',
        'none'
      )
      // Reload to close click menu
      cy.reload()
    })
  })

  describe('When Authenticated', () => {
    const testPrivateTemplateId = 'testprivatetemplate'
    const testPrivateTemplate = {
      name: 'test private template',
      createdBy: Cypress.env('TEST_UID'),
      createdAt: firebase.firestore.Timestamp.now(),
      public: false
    }

    before(() => {
      cy.login()
      cy.callFirestore(
        'set',
        `${ACTION_TEMPLATES_COLLECTION}/${testPrivateTemplateId}`,
        testPrivateTemplate
      )
    })

    it('Shows public templates', () => {
      cy.get(createSelector('action-template-card-public')).should(
        'have.length.gte',
        1
      )
    })

    // Skipped because clicking away was not working as expected in CI
    it('Disables actions of public template for users who are not the author of the template', () => {
      cy.get(createSelector('action-template-card-public-actions')).click()
      // Confirm that edit and remove options are disabled
      cy.get(createSelector('action-template-edit')).should(
        'have.css',
        'pointer-events',
        'none'
      )
      cy.get(createSelector('action-template-delete')).should(
        'have.css',
        'pointer-events',
        'none'
      )
      // Reload to close click menu
      cy.reload()
    })

    it('Shows private templates created by the current user', () => {
      cy.get(createSelector('action-template-card-private')).should(
        'have.length.gte',
        1
      )
    })

    it('Allows user to create a new template', () => {
      const newTemplateName = 'new test template'
      const newTemplateDescription = 'new test template'
      cy.get(createSelector('new-template-button')).click()
      cy.get(createSelector('new-template-name')).type(newTemplateName)
      cy.get(createSelector('new-template-description')).type(
        newTemplateDescription
      )
      cy.get(createSelector('new-template-submit-button')).click()
      // Confirm that new template tile appears
      cy.get(
        createSelector(`action-template-title-${testPublicTemplateId}`)
      ).should('have.text', testPublicTemplate.name)
      // Confirm that template was added to Firestore with correct data
      cy.callFirestore('get', ACTION_TEMPLATES_COLLECTION, {
        where: ['createdBy', '==', Cypress.env('TEST_UID')],
        orderBy: ['createdAt', 'desc'],
        limit: 1
      }).then((newTemplates) => {
        expect(newTemplates).to.be.an('array')
        const [newTemplate] = newTemplates
        expect(newTemplate).to.have.property('name', newTemplateName)
        expect(newTemplate).to.have.property(
          'description',
          newTemplateDescription
        )
        expect(newTemplate).to.have.property('public', false)
        expect(newTemplate).to.have.property('createdAt')
      })
    })
  })
})
