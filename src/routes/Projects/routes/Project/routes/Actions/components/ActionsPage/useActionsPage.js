import { get, omit, map, some, findIndex } from 'lodash'
import {
  useDatabase,
  useUser,
  useFirestore,
  useFirestoreCollectionData
} from 'reactfire'
import { ACTION_RUNNER_REQUESTS_PATH } from 'constants/firebasePaths'
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
  closeRunnerSections,
  selectActionTemplate,
  selectedTemplate,
  watch
}) {
  const { showError, showMessage } = useNotifications()
  const database = useDatabase()
  const firestore = useFirestore()
  const user = useUser()
  const { FieldValue } = useFirestore
  const environmentValues = watch('environmentValues')
  const environmentsRef = firestore.collection(
    `projects/${projectId}/environments`
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
  const selectedEnvironments = map(
    environmentValues,
    (envKey) => environmentsById[envKey]
  )
  const lockedEnvInUse = getLockedEnvInUse(selectedEnvironments)

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
