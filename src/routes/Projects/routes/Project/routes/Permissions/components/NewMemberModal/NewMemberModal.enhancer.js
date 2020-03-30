import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { get, map, findIndex } from 'lodash'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import { compose } from 'redux'
import { withHandlers, setPropTypes, withStateHandlers } from 'recompose'
import { withNotifications } from 'modules/notification'
import { withStyles } from '@material-ui/core/styles'
import styles from './NewMemberModal.styles'

export default compose(
  withNotifications,
  withFirestore,
  withStateHandlers(
    ({ initialDialogOpen = false }) => ({
      sharingDialogOpen: initialDialogOpen,
      selectedCollaborators: [],
      suggestions: [],
      value: ''
    }),
    {
      setSuggestions: () => (suggestions) => ({
        suggestions
      }),
      clearSuggestions: () => () => ({
        suggestions: []
      }),
      selectCollaborator: ({ selectedCollaborators }) => (newCollaborator) => {
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
      handleChange: () => (e) => ({
        value: e.target.value
      }),
      reset: () => () => ({
        selectedCollaborators: [],
        suggestions: [],
        value: ''
      })
    }
  ),
  // props used in handlers
  setPropTypes({
    onRequestClose: PropTypes.func.isRequired,
    showSuccess: PropTypes.func.isRequired, // from withNotifications
    showError: PropTypes.func.isRequired, // from withNotifications
    reset: PropTypes.func.isRequired
  }),
  connect(({ firebase, firestore: { data } }, { projectId }) => ({
    project: get(data, `projects.${projectId}`),
    collaborators: map(
      get(data, `projects.${projectId}.collaborators`),
      (val, key) => key
    )
  })),
  withHandlers({
    closeAndReset: ({ reset, onRequestClose }) => () => {
      reset()
      onRequestClose()
    },
    callSubmit: ({
      firebase,
      firestore,
      onRequestClose,
      showSuccess,
      showError,
      selectedCollaborators,
      project,
      projectId
    }) => async (newInstance) => {
      // Get existing collaborators and permissions
      const collaborators = get(project, 'collaborators', {})
      const permissions = get(project, 'permissions', {})
      // Add new collaborators from selectCollaborator prop
      selectedCollaborators.forEach((currentCollaborator) => {
        // Only add new collaborators which do not already exist
        if (!get(project, `collaborators.${currentCollaborator.objectID}`)) {
          collaborators[currentCollaborator.objectID] = true
          permissions[currentCollaborator.objectID] = {
            permission: 'viewer',
            sharedAt: firestore.FieldValue.serverTimestamp()
          }
        }
      })
      try {
        await firestore
          .doc(`projects/${projectId}`)
          .update({ collaborators, permissions })
        onRequestClose()
        showSuccess('Collaborator added successfully')
      } catch (err) {
        showError('Collaborator could not be added')
        throw err
      }
    }
  }),
  withStyles(styles)
)
