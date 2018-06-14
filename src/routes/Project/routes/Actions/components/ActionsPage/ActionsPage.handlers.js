import { get, invoke, omit } from 'lodash'
import { firebasePaths, formNames } from 'constants'
import { pushAndWaitForStatus } from 'utils/firebaseFunctions'
import { submit } from 'redux-form'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import { to } from 'utils/async'

export function submitActionRunner({ dispatch }) {
  return () => {
    dispatch(submit(formNames.actionRunner))
  }
}

/**
 * Run action handler
 * @param  {Object} props - component props
 * @return {Function} A function which calls to run an action based on specified
 * config
 */
export function runAction(props) {
  return async formValues => {
    const {
      firebase,
      firestore,
      params: { projectId },
      uid,
      selectedTemplate,
      environments,
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
      createdBy: uid,
      createdAt: firestore.FieldValue.serverTimestamp()
    }
    // Convert selected environment keys into their associated environment objects
    if (environmentValues) {
      actionRequest.environments = environmentValues.map(
        envId => environments[envId] || envId
      )
    }
    // TODO: Show error notification if required action inputs are not selected
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
          createdBy: uid
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
          // props.clearRunner()
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
}
