import { compose } from 'redux'
import { withProps, withHandlers, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import { get, pick } from 'lodash'
import withFirestore from 'react-redux-firebase/lib/withFirestore'
import withFirebase from 'react-redux-firebase/lib/withFirebase'
import { formValues, reduxForm } from 'redux-form'
import { databaseURLToProjectName } from 'utils'
import { waitForCompleted } from 'utils/firebaseFunctions'
import { withNotifications } from 'modules/notification'
import { spinnerWhile } from 'utils/components'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { withStyles } from '@material-ui/core/styles'
import styles from './BucketConfigForm.styles'

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
      setConfig: () => (currentConfig) => ({ currentConfig })
    }
  ),
  // map redux state to props
  connect(({ firestore: { ordered, data } }, { projectId, currentConfig }) => ({
    projectEnvironments: get(ordered, `environments-${projectId}`),
    projectEnvironmentsById: get(data, `environments-${projectId}`),
    initialValues: {
      body: currentConfig,
      method: 'GET'
    }
  })),
  // Handlers as props
  withHandlers({
    onSubmit: ({
      firebase,
      firestore,
      showSuccess,
      showError,
      setConfig,
      storageBucket,
      projectEnvironmentsById,
      project,
      projectId
    }) => async (bucketConfig) => {
      try {
        const databaseURL = get(
          projectEnvironmentsById,
          `${bucketConfig.environment}.databaseURL`
        )
        const databaseName =
          databaseURL && databaseURLToProjectName(databaseURL)
        // Push request to callGoogleApi cloud function
        const pushRef = await firebase.pushWithMeta('requests/callGoogleApi', {
          api: 'storage',
          ...pick(bucketConfig, ['method', 'cors', 'environment']),
          projectId,
          databaseName,
          databaseURL,
          storageBucket: `${databaseName}.appspot.com`
        })
        const pushKey = pushRef.key
        // wait for response (written by cloud function)
        const results = await waitForCompleted(
          firebase.ref(`responses/callGoogleApi/${pushKey}`)
        )
        // Handle error calling google api (written to response)
        if (results.error) {
          showError(`Error calling Google api: ${results.error}`)
          throw new Error(results.error)
        }
        if (
          bucketConfig.method === 'GET' &&
          !get(results, 'responseData.cors')
        ) {
          showSuccess('No CORS config currently exists for this bucket')
        } else {
          // Set config
          setConfig(pick(results.responseData, ['cors']))
          showSuccess('Storage Bucket Config Get Successful')
          triggerAnalyticsEvent('bucketAction', {
            method: bucketConfig.method || 'GET',
            resouce: 'CORS'
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
            `Storage Bucket ${
              bucketConfig.method || 'UPDATE'
            } completed Successfully`
          )
        }
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
  withProps(({ projectEnvironmentsById, environment }) => {
    const databaseURL = get(
      projectEnvironmentsById,
      `${environment}.databaseURL`
    )
    const databaseName = databaseURL && databaseURLToProjectName(databaseURL)
    return {
      databaseName,
      storageBucket: databaseName && `${databaseName}.appspot.com`
    }
  }),
  // Show a loading spinner while submitting
  spinnerWhile(({ submitting }) => submitting),
  withStyles(styles)
)
