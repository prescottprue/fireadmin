import { compose } from 'redux'
import { withProps, withHandlers, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withFirebase, withFirestore } from 'react-redux-firebase'
import { formValues, reduxForm } from 'redux-form'
import { databaseURLToProjectName } from 'utils'
import { waitForCompleted } from 'utils/firebaseFunctions'
import { withNotifications } from 'modules/notification'
import { spinnerWhile } from 'utils/components'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
const formName = 'bucketConfig'

export default compose(
  // add props.showSuccess and props.showError
  withNotifications,
  // Add props.firebase
  withFirebase,
  withFirestore,
  // State handlers as props
  withStateHandlers(
    ({ initialSelected = null }) => ({
      currentConfig: null
    }),
    {
      setConfig: () => currentConfig => ({ currentConfig })
    }
  ),
  // Handlers as props
  withHandlers({
    callGoogleApi: ({
      firebase,
      firestore,
      showSuccess,
      showError,
      setConfig,
      storageBucket,
      serviceAccount,
      project,
      projectId
    }) => async bucketConfig => {
      try {
        const databaseURL = get(
          project,
          `environments.${bucketConfig.environment}.databaseURL`
        )
        const databaseName =
          databaseURL && databaseURLToProjectName(databaseURL)
        const pushRef = await firebase.pushWithMeta('requests/googleApi', {
          api: 'storage',
          ...bucketConfig,
          storageBucket: `${databaseName}.appspot.com`
        })
        const pushKey = pushRef.key
        const results = await waitForCompleted(
          firebase.ref(`responses/googleApi/${pushKey}`)
        )
        if (results.error) {
          throw new Error(results.error)
        }
        setConfig(results.responseData)
        showSuccess('Storage Bucket Config Get Successful')
        triggerAnalyticsEvent({
          category: 'Project',
          action: `${bucketConfig.method || 'GET'} Bucket Config`
        })
        await createProjectEvent(
          { firestore, projectId },
          {
            eventType: `${
              bucketConfig.method ? bucketConfig.method.toLowerCase() : 'get'
            }BucketConfig`,
            eventData: { bucketConfig },
            createdBy: firebase._.authUid
          }
        )
        showSuccess(
          `Storage Bucket ${bucketConfig.method ||
            'UPDATE'} completed Successfully`
        )
      } catch (err) {
        if (err.message.indexOf('access to') !== -1) {
          showError('Error: Service Account Does Not Have Access')
          throw new Error('Service Account does not have Access')
        }
        showError('Error Updating Storage Bucket Config')
        throw err
      }
    }
  }),
  // Add props
  withProps(({ callGoogleApi }) => {
    return {
      onSubmit: callGoogleApi // so redux-form submit calls callGoogleApi
    }
  }),
  // map redux state to props
  connect(({ firestore: { ordered } }, { projectId, currentConfig }) => ({
    serviceAccounts: get(ordered, `serviceAccounts-${projectId}`),
    initialValues: {
      body: currentConfig,
      method: 'GET'
    }
  })),
  // form capability including submit
  reduxForm({
    form: formName,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  }),
  formValues('serviceAccount'),
  formValues('environment'),
  formValues('body'),
  formValues('method'),
  // Add more props
  withProps(({ project, environment }) => {
    const databaseURL = get(project, `environments.${environment}.databaseURL`)
    const databaseName = databaseURL && databaseURLToProjectName(databaseURL)
    return {
      databaseName,
      storageBucket: databaseName && `${databaseName}.appspot.com`
    }
  }),
  // Show a loading spinner while submitting
  spinnerWhile(({ submitting }) => submitting)
)
