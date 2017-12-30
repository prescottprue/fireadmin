import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirestore, withFirebase } from 'react-redux-firebase'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import { invoke, get, findIndex } from 'lodash'
import { withNotifications } from 'modules/notification'
import { trackEvent } from 'utils/analytics'

export default compose(
  withFirestore,
  withFirebase,
  withNotifications,
  connect(({ firestore: { data: { users } } }, { params }) => ({
    users
  })),
  withStateHandlers(
    ({ initialDialogOpen = false }) => ({
      sharingDialogOpen: initialDialogOpen,
      selectedCollaborators: [],
      suggestions: [],
      value: ''
    }),
    {
      setSuggestions: () => suggestions => ({
        suggestions
      }),
      clearSuggestions: () => () => ({
        suggestions: []
      }),
      selectCollaborator: ({ selectedCollaborators }) => newCollaborator => {
        const currentIndex = findIndex(selectedCollaborators, {
          objectID: newCollaborator.id || newCollaborator.objectID
        })
        const newSelected = [...selectedCollaborators]

        if (currentIndex === -1) {
          newSelected.push(newCollaborator)
        } else {
          newSelected.splice(currentIndex, 1)
        }

        return {
          selectedCollaborators: newSelected
        }
      },
      handleChange: () => e => ({
        value: e.target.value
      }),
      reset: () => () => ({
        selectedCollaborators: [],
        suggestions: [],
        value: ''
      })
    }
  ),
  withHandlers({
    saveCollaborators: ({
      firestore,
      firebase,
      uid,
      project,
      showError,
      onRequestClose,
      selectedCollaborators,
      showSuccess
    }) => async newInstance => {
      // if (!uid) {
      //   return showError('You must be logged in to add a ')
      // }
      // TODO: Support adding collaborators if you have permission
      // if (project.createdBy !== uid) {
      //   return showError('You must be the project owner to add a collaborator')
      // }
      const currentProject = await firestore.get(`projects/${project.id}`)
      const collaborators = {}
      const collaboratorPermissions = {}
      const projectData = invoke(currentProject, 'data')
      selectedCollaborators.forEach(currentCollaborator => {
        if (
          !get(projectData, `collaborators.${currentCollaborator.objectID}`)
        ) {
          collaborators[currentCollaborator.objectID] = true
          collaboratorPermissions[currentCollaborator.objectID] = {
            permission: 'viewer',
            sharedAt: Date.now()
          }
        }
      })
      try {
        await firebase
          .firestore()
          .doc(`projects/${project.id}`)
          .update({ collaborators, collaboratorPermissions })
        onRequestClose()
        showError('Collaborator added successfully')
        trackEvent({ category: 'Projects', action: 'Add Collaborator' })
      } catch (err) {
        showError('Error adding collaborator')
      }
    }
  }),
  withProps(({ onRequestClose, reset }) => ({
    closeAndReset: () => {
      onRequestClose()
      reset()
    }
  }))
)
