import { compose } from 'redux'
import { withProps, withHandlers, withStateHandlers } from 'recompose'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { databaseURLToProjectName } from 'utils'
import { withFirebase } from 'react-redux-firebase'
import { formValues, reduxForm } from 'redux-form'
import { waitForCompleted } from 'utils/firebaseFunctions'
import { withNotifications } from 'modules/notification'
import { spinnerWhile } from 'utils/components'
const formName = 'bucketConfig'

export default compose(
  withNotifications,
  withFirebase,
  withStateHandlers(
    ({ initialSelected = null }) => ({
      currentConfig: null
    }),
    {
      setConfig: () => currentConfig => ({ currentConfig })
    }
  ),
  withHandlers({
    callGoogleApi: ({
      firebase,
      showSuccess,
      showError,
      setConfig,
      storageBucket,
      serviceAccount,
      project
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
        setConfig(results.responseData)
        showSuccess('Storage Bucket Config Get Successful')
      } catch (err) {
        showError('Error Updating Storage Bucket Config')
        throw err
      }
    }
  }),
  withProps(({ callGoogleApi }) => {
    return {
      onSubmit: callGoogleApi
    }
  }),
  connect((state, props) => ({
    initialValues: {
      body: props.currentConfig
    }
  })),
  reduxForm({
    form: formName,
    enableReinitialize: true,
    keepDirtyOnReinitialize: true
  }),
  formValues('serviceAccount'),
  formValues('environment'),
  formValues('body'),
  formValues('method'),
  withProps(({ project, environment }) => {
    const databaseURL = get(project, `environments.${environment}.databaseURL`)
    const databaseName = databaseURL && databaseURLToProjectName(databaseURL)
    return {
      databaseName,
      storageBucket: databaseName && `${databaseName}.appspot.com`
    }
  }),
  spinnerWhile(({ submitting }) => submitting)
)
