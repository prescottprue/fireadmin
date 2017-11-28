import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirestore, withFirebase } from 'react-redux-firebase'
import { withHandlers, withStateHandlers } from 'recompose'
import { invoke, get } from 'lodash'
import { withNotifications } from 'modules/notification'

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
      selectCollaborator: ({ selectedCollaborators }) => newCollaborator => ({
        selectedCollaborators: [...selectedCollaborators, newCollaborator]
      }),
      handleChange: () => e => ({
        value: e.target.value
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
      const promises = []
      selectedCollaborators.forEach(currentCollaborator => {
        if (
          !get(
            invoke(currentProject, 'data'),
            `collaborators.${currentCollaborator.objectID}`
          )
        ) {
          promises.push(
            firebase
              .firestore()
              .doc(
                `projects/${project.id}/collaborators/${currentCollaborator.objectID}`
              )
              .set({ permission: 'viewer', sharedAt: Date.now() })
          )
        }
      })
      await Promise.all(promises)
      onRequestClose()
      showError('Collaborator added successfully')
    }
  })
)
