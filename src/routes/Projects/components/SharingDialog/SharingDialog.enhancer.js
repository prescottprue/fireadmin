import { get, findIndex, map } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withFirestore, firebaseConnect } from 'react-redux-firebase'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import { withNotifications } from 'modules/notification'
import * as handlers from './SharingDialog.handlers'

export default compose(
  withFirestore,
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
  withHandlers(handlers),
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
