import { get, omit } from 'lodash'
import { useDatabase, useAuth, useFirestore } from 'reactfire'
import { ACTION_RUNNER_REQUESTS_PATH } from 'constants/firebasePaths'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'

export default function useActionRunner({
  projectId,
  closeRunnerSections,
  selectActionTemplate,
  selectedTemplate
}) {
  const { showError, showMessage } = useNotifications()
  const database = useDatabase()
  const firestore = useFirestore()
  const auth = useAuth()
  const lockedEnvInUse = false // TODO: Load this from Firestore data
  const environmentsById = {} // TODO: Load this from Firestore data
  const environments = {} // TODO: Load this from Firestore data

  function runAction(formValues) {
    if (lockedEnvInUse) {
      const errMsg = 'Action Runner Disabled. Locked environment selected.'
      showError(errMsg)
      console.error(errMsg) // eslint-disable-line no-console
      throw new Error(errMsg)
    }
    const { environmentValues } = formValues
    const templateId = get(selectedTemplate, 'templateId')
    if (!templateId) {
      const errMsg =
        'A valid template must be selected in order to run an action'
      showError(errMsg)
      triggerAnalyticsEvent('invalidTemplateRunAttempt', {
        projectId: projectId,
        environmentValues
      })
      throw new Error(errMsg)
    }
    // Build request object for action run
    const actionRequest = {
      projectId: projectId,
      serviceAccountType: 'firestore',
      templateId,
      template: omit(selectedTemplate, ['_highlightResult']),
      ...omit(formValues, ['_highlightResult', 'updatedAt'])
    }
    // Convert selected environment keys into their associated environment objects
    if (environmentValues) {
      actionRequest.environments = environmentValues.map((envId) => {
        const environmentById = environmentsById[envId]
        if (environmentById) {
          return { ...environmentById, id: envId }
        }
        return environments[envId] || envId
      })
    }

    // TODO: Show error notification if required action inputs are not selected
    // props.closeTemplateEdit()
    triggerAnalyticsEvent('requestActionRun', {
      projectId,
      templateId,
      environmentValues
    })

    return Promise.all([
      database.push(ACTION_RUNNER_REQUESTS_PATH, actionRequest),
      createProjectEvent(
        { firestore, projectId },
        {
          eventType: 'requestActionRun',
          eventData: omit(
            {
              ...actionRequest,
              template: {
                ...omit(selectedTemplate, ['_highlightResult']),
                inputValues: actionRequest.inputValues || []
              }
            },
            ['_highlightResult']
          ),
          createdBy: auth.currentUser.uid
        }
      )
    ])
      .then(() => {
        // Close sections used for action runner input
        closeRunnerSections()
        // Notify user that action run has started
        showMessage('Action Run Started!')
      })
      .catch((err) => {
        console.error('Error: ', err.message || err) // eslint-disable-line no-console
        showError('Error staring action request')
      })
  }

  /**
   * A handler which sets up the actionRunner with the same settings
   * as a previous run.
   * @param {Object} props - component props
   * @return {Function} A handler function which sets up the action
   * runner with the same settings as a previous run
   */
  function rerunAction(action) {
    const templateWithValues = {
      ...action.eventData,
      ...action.eventData.template,
      inputValues: action.eventData.inputValues,
      environmentValues: action.eventData.environmentValues
    }
    selectActionTemplate(templateWithValues)
  }

  return {
    runAction,
    rerunAction
  }
}
