import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { reset } from 'redux-form'
import { withHandlers, withStateHandlers } from 'recompose'
import { firebaseConnect, getVal, firestoreConnect } from 'react-redux-firebase'
import { formNames } from 'constants'
import {
  // logProps,
  // messageWhileEmpty,
  spinnerWhileLoading
} from 'utils/components'
import { withNotifications } from 'modules/notification'
import { trackEvent } from 'utils/analytics'

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
  withHandlers({
    addEnvironment: props => async newProjectData => {
      const {
        firestore,
        params: { projectId },
        selectedServiceAccount,
        serviceAccounts
      } = props
      const locationConf = {
        collection: 'projects',
        doc: projectId,
        subcollections: [{ collection: 'environments' }]
      }
      const serviceAccount = get(serviceAccounts, selectedServiceAccount, null)
      // Show error if service account is not selected (not part of form)
      if (!serviceAccount) {
        return props.showError('Please select a service account')
      }
      // Build new environment object
      const newEnv = {
        ...newProjectData,
        serviceAccount,
        projectId
      }

      try {
        // Write new environment to firestore
        const newEnvironmentRes = await firestore.add(locationConf, newEnv)
        // Add service account to service accounts collection
        await firestore.add(
          {
            collection: 'projects',
            doc: projectId,
            subcollections: [
              { collection: 'environments', doc: newEnvironmentRes.id },
              { collection: 'serviceAccounts' }
            ]
          },
          serviceAccount
        )
        // Reset form for future use
        props.dispatch(reset(formNames.newEnvironment))
        // Close AddEnvironmentDialog
        props.toggleDialog()
        // Unselect selected service account
        props.clearServiceAccount()
        // Show success snackbar
        props.showSuccess('Environment added successfully')
        trackEvent({ category: 'Project', action: 'Add Environment' })
      } catch (err) {
        console.error('error', err) // eslint-disable-line no-console
        props.showError('Error: ', err.message || 'Could not add project')
      }
    },
    removeEnvironment: props => async environmentId => {
      const { firestore, showError, showSuccess, params: { projectId } } = props
      try {
        await firestore.delete({
          collection: 'projects',
          doc: projectId,
          subcollections: [{ collection: 'environments', doc: environmentId }]
        })
        showSuccess('Environment deleted successfully')
        trackEvent({ category: 'Project', action: 'Remove Environment' })
      } catch (err) {
        console.error('error', err) // eslint-disable-line no-console
        showError('Error: ', err.message || 'Could not remove environment')
      }
    },
    updateEnvironment: props => async newValues => {
      const { params: { projectId }, selectedKey } = props
      try {
        await props.firestore.update(
          {
            collection: 'projects',
            doc: projectId,
            subcollections: [{ collection: 'environments', doc: selectedKey }]
          },
          newValues
        )
        props.toggleDialog()
        props.showSuccess('Environment updated successfully')
        trackEvent({ category: 'Project', action: 'Update Environment' })
      } catch (err) {
        console.error('error', err) // eslint-disable-line no-console
        props.showError(
          'Error: ',
          err.message || 'Could not update environment'
        )
      }
    },
    uploadServiceAccount: props => files => {
      const {
        firebase,
        showSuccess,
        auth: { uid },
        params: { projectId }
      } = props
      const filePath = `serviceAccounts/${uid}/${projectId}`
      return firebase
        .uploadFiles(filePath, files, `serviceAccounts/${projectId}`)
        .then(res => {
          props.selectServiceAccount(res)
          trackEvent({ category: 'Project', action: 'Upload Service Account' })
          showSuccess('Service Account Uploaded successfully')
        })
    }
  })
)
