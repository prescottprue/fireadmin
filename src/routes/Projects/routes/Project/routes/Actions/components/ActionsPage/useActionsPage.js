import { omit, map, some, findIndex } from 'lodash'
import {
  useDatabase,
  useUser,
  useFirestore,
  useFirestoreCollectionData
} from 'reactfire'
import * as Sentry from '@sentry/browser'
import {
  ACTION_RUNNER_REQUESTS_PATH,
  PROJECTS_COLLECTION
} from 'constants/firebasePaths'
import { triggerAnalyticsEvent, createProjectEvent } from 'utils/analytics'
import useNotifications from 'modules/notification/useNotifications'

function instanceTypeInUse(environments, type = 'src') {
  const lockedEnvIndex = findIndex(environments, {
    [`${type}Only`]: true
  })
  if (lockedEnvIndex === -1) {
    return false
  }
  // TODO: Make this aware of if the position is actually src/dest based on template instead of using index
  return type === 'src' ? lockedEnvIndex === 0 : lockedEnvIndex === 1
}

function getLockedEnvInUse(environments) {
  if (!environments.length) {
    return false
  }
  // TODO: Make this aware of if the action template is a copy or not
  return (
    some(environments, 'locked') ||
    instanceTypeInUse(environments, 'read') ||
    instanceTypeInUse(environments, 'write')
  )
}

export default function useActionRunner({
  projectId,
  selectActionTemplate,
  selectedTemplate,
  setValue
}) {
  const { showError, showMessage } = useNotifications()
  const database = useDatabase()
  const firestore = useFirestore()
  const user = useUser()
  const { FieldValue } = useFirestore
  const { ServerValue } = useDatabase
  const environmentsRef = firestore.collection(
    `${PROJECTS_COLLECTION}/${projectId}/environments`
  )
  const environments = useFirestoreCollectionData(environmentsRef, {
    idField: 'id'
  })
  const environmentsById = environments.reduce((acc, environment) => {
    return {
      ...acc,
      [environment.id]: environment
    }
  }, {})

  async function runAction(formValues) {
    const { environmentValues } = formValues
    const selectedEnvironments = map(
      environmentValues,
      (envKey) => environmentsById[envKey]
    )
    const lockedEnvInUse = getLockedEnvInUse(selectedEnvironments)
    if (lockedEnvInUse) {
      const errMsg = 'Action Runner Disabled. Locked environment selected.'
      showError(errMsg)
      console.error(errMsg) // eslint-disable-line no-console
      return errMsg
    }

    // Show error and exit if template is not selected
    if (!selectedTemplate?.templateId) {
      const errMsg =
        'A valid template must be selected in order to run an action'
      showError(errMsg)
      triggerAnalyticsEvent('invalidTemplateRunAttempt', {
        projectId,
        environmentValues
      })
      return errMsg
    }

    const { templateId } = selectedTemplate
    // Build request object for action run
    const actionRequest = {
      ...omit(formValues, ['_highlightResult', 'updatedAt', 'createdAt']),
      projectId,
      serviceAccountType: 'firestore',
      templateId,
      createdBy: user.uid,
      createdAt: ServerValue.TIMESTAMP,
      template: omit(selectedTemplate, ['_highlightResult'])
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
    // TODO: Switch to onCall function instead of pushing requests to RTDB
    try {
      await Promise.all([
        database.ref(ACTION_RUNNER_REQUESTS_PATH).push(actionRequest),
        createProjectEvent(
          { firestore, projectId, FieldValue },
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
            createdBy: user.uid
          }
        )
      ])
      // Notify user that action run has started
      showMessage('Action Run Started!')
    } catch (err) {
      console.error('Error starting action request: ', err.message) // eslint-disable-line no-console
      showError('Error starting action request')
      Sentry.captureException(err)
      triggerAnalyticsEvent('action-run-error', {
        err,
        message: err.message,
        projectId,
        templateId,
        environmentValues
      })
    }
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
    if (selectedTemplate) {
      selectActionTemplate(null)
      // Timeout is needed in order to cause re-render of form
      setTimeout(() => {
        selectActionTemplate(templateWithValues)
      })
    } else {
      selectActionTemplate(templateWithValues)
    }
  }

  return {
    runAction,
    rerunAction
  }
}
