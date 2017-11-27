import { compose } from 'redux'
import { withHandlers, withStateHandlers } from 'recompose'
import { invoke } from 'lodash'
import { reduxForm } from 'redux-form'
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
      handleChange: () => value => ({
        value
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
      try {
        const reqSnap = await firebase.push('search/queries', query)
        const results = await waitForResponse(firebase, reqSnap.key)
        // console.log('results:', results)
        setSuggestions(results)
      } catch (err) {
        showError('Error: ', err.message || 'Could not add project')
        throw err
      }
    }
  }),
  reduxForm({
    form: 'sharingDialog'
  })
)
