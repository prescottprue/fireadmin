import { invoke, get, findIndex, map } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {
  withFirestore,
  withFirebase,
  firebaseConnect
} from 'react-redux-firebase'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import { withNotifications } from 'modules/notification'
import { triggerAnalyticsEvent } from 'utils/analytics'

export default compose(
  withFirestore,
  withFirebase,
  withNotifications,
  firebaseConnect(['displayNames']),
  connect(({ firebase: { data: { displayNames } } }, { params }) => ({
    displayNames
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
      const currentProject = await firestore.get(`projects/${project.id}`)
      const projectData = invoke(currentProject, 'data')
      const collaborators = get(projectData, 'collaborators', {})
      const collaboratorPermissions = get(
        projectData,
        'collaboratorPermissions',
        {}
      )
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
        showSuccess('Collaborator added successfully')
        triggerAnalyticsEvent({
          category: 'Projects',
          action: 'Add Collaborator'
        })
      } catch (err) {
        showError('Collaborator could not be added')
        throw err
      }
    }
  }),
  withHandlers({
    closeAndReset: ({ onRequestClose, reset }) => () => {
      onRequestClose()
      reset()
    }
  }),
  withProps(({ project, displayNames }) => {
    const collaborators = get(project, 'collaborators')
    if (collaborators) {
      return {
        projectCollaborators: map(collaborators, (collaborator, collabId) =>
          get(displayNames, collabId, 'User')
        )
      }
    }
  })
)
