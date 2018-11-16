import { get, omit } from 'lodash'
import { firebasePaths, formNames } from 'constants'
import { submit, initialize } from 'redux-form'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'

/**
 * A handler for remote submitting the action runner
 * @param {Object} props - component props
 */
export function submitActionRunner({ dispatch }) {
  return () => {
    dispatch(submit(formNames.actionRunner))
  }
}

/**
 * A handler which sets up the actionRunner with the same settings
 * as a previous run.
 * @param {Object} props - component props
 * @return {Function} A handler function which sets up the action
 * runner with the same settings as a previous run
 */
export function rerunAction(props) {
  return action => {
    const templateWithValues = {
      ...action.eventData,
      ...action.eventData.template,
      inputValues: action.eventData.inputValues,
      environmentValues: action.eventData.environmentValues
    }
    props.selectActionTemplate(templateWithValues)
    props.dispatch(
      initialize(formNames.actionRunner, templateWithValues, false, {
        keepValues: false
      })
    )
  }
}

/**
 * A handler which starts an action run
 * @param  {Object} props - component props
 * @return {Function} A function which calls to run an action based on specified
 * config
 */
export function runAction(props) {
  return formValues => {
    if (props.lockedEnvInUse) {
      const errMsg = 'Action Runner Disabled. Locked environment selected.'
      props.showError(errMsg)
      console.error(errMsg) // eslint-disable-line no-console
      throw new Error(errMsg)
    }
    const { environmentValues } = formValues
    const templateId = get(props, 'selectedTemplate.templateId')
    // Build request object for action run
    const actionRequest = {
      projectId: props.params.projectId,
      serviceAccountType: 'firestore',
      templateId,
      template: omit(props.selectedTemplate, ['_highlightResult']),
      ...formValues
    }
    // Convert selected environment keys into their associated environment objects
    if (environmentValues) {
      actionRequest.environments = environmentValues.map(envId => {
        const environmentById = props.environmentsById[envId]
        if (environmentById) {
          return { ...environmentById, id: envId }
        }
        return props.environments[envId] || envId
      })
    }

    // TODO: Show error notification if required action inputs are not selected
    props.closeTemplateEdit()
    triggerAnalyticsEvent('requestActionRun', {
      projectId: props.projectId,
      templateId,
      environmentValues
    })
    return Promise.all([
      props.firebase.pushWithMeta(
        firebasePaths.actionRunnerRequests,
        actionRequest
      ),
      createProjectEvent(
        { firestore: props.firestore, projectId: props.projectId },
        {
          eventType: 'requestActionRun',
          eventData: omit(
            {
              ...actionRequest,
              template: {
                ...omit(props.selectedTemplate, ['_highlightResult']),
                inputValues: actionRequest.inputValues || []
              }
            },
            ['_highlightResult']
          ),
          createdBy: props.uid
        }
      )
    ])
      .then(() => {
        // Close sections used for action runner input
        props.closeRunnerSections()
        // Notify user that action run has started
        props.showMessage('Action Run Started!')
      })
      .catch(err => {
        console.error('Error: ', err.message || err) // eslint-disable-line no-console
        return props.showError('Error staring action request')
      })
  }
}
