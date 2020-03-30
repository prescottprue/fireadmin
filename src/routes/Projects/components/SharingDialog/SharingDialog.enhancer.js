import { get, findIndex, map } from 'lodash'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import firebaseConnect from 'react-redux-firebase/lib/firebaseConnect'
import {
  withHandlers,
  withStateHandlers,
  withProps,
  setPropTypes
} from 'recompose'
import { withNotifications } from 'modules/notification'
import * as handlers from './SharingDialog.handlers'

export default compose(
  // Add props.firestore
  withFirestore,
  // Add props.showSuccess and props.showError
  withNotifications,
  // Attach/Detach RTDB listeners on mount/unmount
  firebaseConnect(['displayNames']),
  // Set proptypes used in HOCs
  setPropTypes({
    firestore: PropTypes.shape({
      doc: PropTypes.func.isRequired // used in handlers
    }).isRequired,
    showSuccess: PropTypes.func.isRequired, // used in handlers
    showError: PropTypes.func.isRequired // used in handlers
  }),
  connect(({ firebase: { data: { displayNames } } }) => ({
    displayNames
  })),
  // State handlers as props
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
  // Handlers as props
  withHandlers(handlers),
  withProps(({ project, displayNames }) => {
    const collaborators = get(project, 'collaborators')
    if (collaborators) {
      return {
        projectCollaborators: map(collaborators, (collaborator, collabId) => {
          return {
            displayName: get(displayNames, collabId, 'User'),
            ...collaborator
          }
        })
      }
    }
  })
)
