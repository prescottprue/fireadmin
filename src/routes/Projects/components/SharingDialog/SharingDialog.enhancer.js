import { compose } from 'redux'
import { withFirebase } from 'react-redux-firebase'
import { withHandlers, withStateHandlers } from 'recompose'
import { invoke } from 'lodash'
import { withNotifications } from 'modules/notification'

const waitForResponse = (firebase, requestKey) =>
  new Promise((resolve, reject) => {
    firebase.ref(`search/results/${requestKey}`).on(
      'value',
      responseSnap => {
        const response = invoke(responseSnap, 'val')
        if (response) {
          resolve(response)
        }
      },
      err => {
        console.error('Error waiting for response:', err.message || err) // eslint-disable-line no-console
        reject(err)
      }
    )
  })

export default compose(
  withFirebase,
  withNotifications,
  withStateHandlers(
    ({ initialDialogOpen = false }) => ({
      sharingDialogOpen: initialDialogOpen,
      suggestions: [],
      value: ''
    }),
    {
      toggleDialog: ({ sharingDialogOpen }) => () => ({
        sharingDialogOpen: !sharingDialogOpen
      }),
      setSuggestions: () => suggestions => ({
        suggestions
      }),
      clearSuggestions: () => () => ({
        suggestions: []
      }),
      handleChange: () => e => ({
        value: e.target.value
      })
    }
  ),
  withHandlers({
    addCollaborator: ({
      firestore,
      uid,
      project,
      showError,
      showSuccess
    }) => newInstance => {
      if (!uid) {
        return showError('You must be logged in to add a ')
      }
      // TODO: Support adding collaborators if you have permission
      if (project.createdBy !== uid) {
        return showError('You must be the project owner to add a collaborator')
      }
      return firestore
        .add({ collection: 'projects' }, { ...newInstance, createdBy: uid })
        .then(res => showSuccess('Project added successfully'))
        .catch(err =>
          showError('Error: ', err.message || 'Could not add project')
        )
    },
    searchUsers: ({ firebase, setSuggestions, showError }) => async query => {
      if (query.value.length < 3) {
        return
      }
      if (query.reason === 'input-focused') {
        return
      }
      try {
        const reqSnap = await firebase.push('search/queries', {
          query: query.value
        })
        const results = await waitForResponse(firebase, reqSnap.key)
        // console.log('results:', results)
        setSuggestions(results.hits)
      } catch (err) {
        showError('Error: ', err.message || 'Could not add project')
        throw err
      }
    }
  })
)
