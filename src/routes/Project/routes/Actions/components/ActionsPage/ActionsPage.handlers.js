import { get, invoke, omit } from 'lodash'
import { firebasePaths, formNames } from 'constants'
import { pushAndWaitForStatus } from 'utils/firebaseFunctions'
import { submit } from 'redux-form'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { to } from 'utils/async'

const credentialFromInputValue = project => environmentKey => {
  const { serviceAccount, databaseURL } = get(
    project,
    `environments.${environmentKey}`,
    {}
  )
  if (serviceAccount && databaseURL) {
    return { environmentKey, ...serviceAccount, databaseURL }
  }
  return environmentKey
}

export const submitActionRunner = ({ dispatch }) => () => {
  dispatch(submit(formNames.actionRunner))
}

export const runAction = props => async formValues => {
  const {
    firebase,
    firestore,
    params: { projectId },
    auth,
    selectedTemplate,
    project,
    toggleActionProcessing
  } = props
  const { environmentValues } = formValues
  // Build request object for action run
  const actionRequest = {
    projectId,
    serviceAccountType: 'firestore',
    templateId: get(selectedTemplate, 'templateId'),
    template: omit(selectedTemplate, ['_highlightResult']),
    ...formValues,
    createdBy: auth.uid,
    createdAt: firestore.FieldValue.serverTimestamp()
  }
  if (environmentValues) {
    actionRequest.environments = environmentValues.map(
      credentialFromInputValue(project)
    )
  }
  // // TODO: Show error notification if required action inputs are not selected
  props.closeTemplateEdit()
  toggleActionProcessing()
  triggerAnalyticsEvent({ category: 'Project', action: 'Start Action Run' })
  // Write event to project events
  const [err] = await to(
    createProjectEvent(
      { firestore, projectId },
      {
        eventType: 'requestActionRun',
        eventData: {
          ...actionRequest,
          template: {
            ...omit(selectedTemplate, ['_highlightResult']),
            inputValues: actionRequest.inputValues || []
          }
        },
        createdBy: auth.uid
      }
    )
  )
  // Handle error pushing event
  if (err) {
    console.error('Error: ', err.message || err) // eslint-disable-line no-console
    toggleActionProcessing()
    return props.showError('Error staring action request')
  }
  props.showSuccess('Action Run Started!')
  // Push request to real time database and wait for response
  pushAndWaitForStatus(
    {
      firebase,
      requestPath: firebasePaths.actionRunnerRequests,
      responsePath: firebasePaths.actionRunnerResponses,
      pushObj: actionRequest
    },
    responseSnap => {
      const { error, progress, completed } = invoke(responseSnap, 'val') || {}
      // Stop processing and show error if response contains error
      if (error) {
        toggleActionProcessing()
        return props.showError(error)
      }
      // Update progress on every response update
      props.setActionProgress(progress)
      // When completed, mark the action as no longer processing and show success
      if (completed) {
        toggleActionProcessing()
        props.clearRunner()
        props.showSuccess('Action complete!')
      }
    },
    listenerError => {
      console.error('Error: ', listenerError.message || listenerError) // eslint-disable-line no-console
      toggleActionProcessing()
      props.showError('Error with action request')
    }
  )
}
