import { findIndex } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import firebaseConnect from 'react-redux-firebase/lib/firebaseConnect'
import { withStateHandlers } from 'recompose'

export default compose(
  // Add props.firestore
  withFirestore,
  // Attach/Detach RTDB listeners on mount/unmount
  firebaseConnect(['displayNames']),
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
  )
)
