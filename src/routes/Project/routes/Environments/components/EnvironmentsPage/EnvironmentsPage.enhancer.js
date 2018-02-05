import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withHandlers, withStateHandlers } from 'recompose'
import { firebaseConnect, getVal, firestoreConnect } from 'react-redux-firebase'
import {
  // logProps,
  // messageWhileEmpty,
  spinnerWhileLoading
} from 'utils/components'
import { withNotifications } from 'modules/notification'
import * as handlers from './EnvironmentsPage.handlers'

export default compose(
  firebaseConnect(({ params }) => [`serviceAccounts/${params.projectId}`]),
  firestoreConnect(({ params }) => [
    {
      collection: 'projects',
      doc: params.projectId,
      subcollections: [{ collection: 'environments' }]
    },
    {
      collection: 'projects',
      doc: params.projectId
    }
  ]),
  connect(({ firebase, firestore: { data } }, { params }) => ({
    auth: firebase.auth,
    project: get(data, `projects.${params.projectId}`),
    serviceAccounts: getVal(
      firebase,
      `data/serviceAccounts/${params.projectId}`
    )
  })),
  // logProps(['project', 'auth']),
  // messageWhileEmpty(['project']),
  spinnerWhileLoading(['project']),
  withNotifications,
  withStateHandlers(
    ({ initialEnvDialogOpen = false }) => ({
      selectedServiceAccount: null,
      selectedInstance: null,
      envDialogOpen: initialEnvDialogOpen
    }),
    {
      toggleDialogWithData: ({ envDialogOpen }) => (action, key) => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: action,
        selectedKey: key
      }),
      toggleDialog: ({ envDialogOpen }) => () => ({
        envDialogOpen: !envDialogOpen,
        selectedInstance: null,
        selectedKey: null
      }),
      selectServiceAccount: ({ selectedServiceAccount }) => pickedAccount => {
        if (selectedServiceAccount === pickedAccount) {
          return {
            selectedServiceAccount: null
          }
        }
        return {
          selectedServiceAccount: pickedAccount
        }
      },
      clearServiceAccount: () => () => ({
        selectedServiceAccount: null
      })
    }
  ),
  withHandlers(handlers)
)
