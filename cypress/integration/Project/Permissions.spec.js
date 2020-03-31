import { createSelector } from '../../utils'
import fakeProject from '../../fixtures/fakeProject.json'

describe('Project - Events Page', () => {
  // Setup before tests including creating a server to listen for external requests
  before(() => {
    // Add a fake project owned by the test user
    cy.callFirestore('set', 'projects/test-project', fakeProject, {
      withMeta: true
    })
    // Login using custom token
    cy.login()
  })

  beforeEach(() => {
    // Go to events page
    cy.visit('projects/test-project/permissions')
  })

  describe('Members', () => {
    const userUid = 'bac123'
    beforeEach(() => {
      cy.callFirestore(
        'set',
        'projects/test-project',
        {
          permissions: {
            [userUid]: { role: 'owner' }
          }
        },
        { merge: true }
      )
    })

    it('updates project with new member role when update member button is clicked', () => {
      const newRole = 'editor'
      cy.get(createSelector('member-expand')).first().click()
      cy.get(createSelector('role-select')).click()
      cy.get(createSelector(`role-option-${newRole}`)).click()
      cy.get(createSelector('update-member-button')).click()
      cy.callFirestore('get', 'projects/test-project').then((project) => {
        expect(project).to.have.nested.property(
          `permissions.${userUid}.role`,
          newRole
        )
      })
    })

    it('removes member from project when delete option is clicked', () => {
      cy.get(createSelector('member-expand')).first().click()
      cy.get(createSelector(`member-more-${userUid}`)).click()
      cy.get(createSelector('member-delete')).click()
      cy.get(createSelector('delete-submit')).click()
      cy.callFirestore('get', 'projects/test-project').then((project) => {
        expect(project).to.not.have.nested.property(`permissions.${userUid}`)
      })
    })
  })

  describe('Roles', () => {
    const roleId = 'owner'

    it('disables update role button if current user does not have permissions', () => {
      cy.callFirestore(
        'set',
        'projects/test-project',
        {
          createdBy: '123ABC',
          collaborators: {
            [Cypress.env('TEST_UID')]: true
          },
          roles: {
            editor: { permissions: { update: { roles: true } } }
          }
        },
        { merge: true }
      ).then(() => {
        cy.get(createSelector(`role-panel-${roleId}`)).click()
        cy.get(createSelector('role-update')).first().should('be.disabled')
      })
    })

    it('enables updates button if user is owner', () => {
      cy.callFirestore(
        'set',
        'projects/test-project',
        {
          createdBy: Cypress.env('TEST_UID'),
          roles: {
            editor: { permissions: { update: { roles: true } } }
          }
        },
        { merge: true }
      ).then(() => {
        cy.get(createSelector(`role-panel-${roleId}`)).click()
        cy.get(createSelector('role-update')).first().should('not.be.disabled')
      })
    })

    it('enables updates button if user has permission', () => {
      cy.callFirestore(
        'set',
        'projects/test-project',
        {
          createdBy: 'abc123',
          collaborators: {
            [Cypress.env('TEST_UID')]: true
          },
          permissions: {
            [Cypress.env('TEST_UID')]: { role: 'owner' }
          },
          roles: {
            owner: { permissions: { update: { roles: true } } }
          }
        },
        { merge: true }
      ).then(() => {
        cy.get(createSelector(`role-panel-owner`)).click()
        cy.get(createSelector('role-update')).first().should('not.be.disabled')
      })
    })

    it('updates project with role permissions', () => {
      cy.get(createSelector(`role-panel-${roleId}`)).click()
      cy.get(createSelector('delete-option-members')).first().click()
      cy.get(createSelector('delete-option-environments')).first().click()
      cy.get(createSelector('delete-option-roles')).first().click()
      cy.get(createSelector('delete-option-permissions')).first().click()
      cy.get(createSelector('role-update')).first().click()
      cy.callFirestore('get', 'projects/test-project').then((project) => {
        expect(project).to.have.nested.property(
          'roles.owner.permissions.delete.members',
          true
        )
        expect(project).to.have.nested.property(
          'roles.owner.permissions.delete.environments',
          true
        )
        expect(project).to.have.nested.property(
          'roles.owner.permissions.delete.roles',
          true
        )
        expect(project).to.have.nested.property(
          'roles.owner.permissions.delete.permissions',
          true
        )
      })
    })

    it('removes role from project when delete option is clicked', () => {
      cy.get(createSelector(`role-panel-${roleId}`)).click()
      cy.get(createSelector(`role-more-${roleId}`)).click()
      cy.get(createSelector('role-delete')).click()
      cy.get(createSelector('delete-submit')).click()
      cy.callFirestore('get', 'projects/test-project').then((project) => {
        expect(project).to.not.have.nested.property(`roles.${roleId}`)
      })
    })
  })
})