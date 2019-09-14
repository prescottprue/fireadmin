import { existsSync } from 'fs'
import { get, find, map } from 'lodash'
import { ActionRequestValue } from '@fireadmin/core/types/types/ActionRequest'
import {
  ActionEnvironmentSetting,
  ActionSettings,
  ActionInputSetting,
  CustomActionStepSetting
} from '@fireadmin/core/types/types/Action'
import { Projects, Project, ActionRequests, ActionTemplates, ActionTemplate } from '@fireadmin/core'
import { to } from './utils/async'
import { prompt } from './utils/prompt'
import { login } from './auth'
import {
  readDirPromise,
  readFilePromise,
  getLocalActionsFolder,
  requireAsync
} from './utils/files'
import { error as logError } from './logger'

/**
 * Get a list of actions from the "actions" or "migrations" folder
 * in the current local file system
 */
async function getLocalActions(): Promise<string[]> {
  const localActionsFolder = getLocalActionsFolder()
  if (!localActionsFolder) {
    throw new Error('Local actions folder not found')
  }
  const actionFiles = await readDirPromise(localActionsFolder)
  return actionFiles
}

/**
 * Load the settings of a local Fireadmin action
 * @param actionName - Name of the action for which to load settings
 */
async function getActionSettings(actionName: string): Promise<ActionSettings | any> {
  const localActionsFolder = getLocalActionsFolder()
  const actionParentPath = `${localActionsFolder}/${actionName}`
  const actionSettingsPath = `${actionParentPath}/settings.json`
  const actionSettingsString: Buffer = await readFilePromise(actionSettingsPath)
  try {
    return JSON.parse(actionSettingsString.toString())
  } catch (err) {
    logError(`Error parsing action settings for action "${actionName}"`) // eslint-disable-line no-console
    return {}
  }
}

/**
 * Get local action settings by asking the user to select
 * the action.
 */
async function getLocalActionSettings(): Promise<ActionRequestValue> {
  // Load actions from current folder and run it by passing in environments (selected by user based on migration settings)
  const localActions = await getLocalActions()
  const actionChoices = localActions.map(actionName => ({
    name: actionName
  }))

  // Propmpt user for choice of actions
  const SELECTED_ACTION_PROMPT_NAME = 'actionName'
  const optionAnswer = await prompt({}, [
    {
      type: 'list',
      name: SELECTED_ACTION_PROMPT_NAME,
      message: 'Which action would you like to run?',
      choices: actionChoices
    }
  ])

  // Get settings for selected action
  const selectedLocalAction = optionAnswer[SELECTED_ACTION_PROMPT_NAME]
  const actionSettings = await getActionSettings(selectedLocalAction)
  const localActionsFolder = getLocalActionsFolder()
  const actionParentPath = `${localActionsFolder}/${optionAnswer[SELECTED_ACTION_PROMPT_NAME]}`
  const environmentSettings: ActionEnvironmentSetting[] = get(
    actionSettings,
    'environments',
    []
  )

  // Login to Fireadmin since next steps will require auth
  await login()

  // Get List of projects (to provide options to use)
  const [getErr, projectsList] = await to(new Projects().get())

  if (getErr) {
    logError('Error getting projects', getErr) // eslint-disable-line no-console
    throw getErr
  }

  // Prompt user to select project
  const SELECTED_PROJECT_PROMPT_NAME = 'projectName'
  const projectAnswers = await prompt({}, [
    {
      type: 'list',
      name: SELECTED_PROJECT_PROMPT_NAME,
      message: 'Which project?',
      choices: projectsList
    }
  ])
  const selectedProjectName = projectAnswers[SELECTED_PROJECT_PROMPT_NAME]
  const project = find(projectsList, { name: selectedProjectName })
  if (!(project instanceof Project)) {
    const missingProjectMsg = 'Project with matching name not found'
    logError(missingProjectMsg)
    throw new Error(missingProjectMsg)
  }

  // Get environments of selected project
  const [getEnvsErr, environmentsOptions] = await to(project.getEnvironments())
  if (getEnvsErr) {
    logError('Error getting environments:', getEnvsErr) // eslint-disable-line no-console
    throw getEnvsErr
  }

  // Ask for environment preferences from Fireadmin project based on template settings
  const environmentQuestions: any[] = environmentSettings.map(
    (setting: ActionEnvironmentSetting) => ({
      ...setting,
      message: `${setting.name} environment`,
      type: 'list',
      choices: environmentsOptions
    })
  )
  const environmentsByName = await prompt({}, environmentQuestions)
  const environmentResults = map(environmentsByName, (environmentName) => {
    const selectedEnvironment: any = find(environmentsOptions, { name: environmentName })
    const { ref, listen, ...other } = selectedEnvironment
    return other
  })
  const environmentValues = map(environmentsByName, (environmentName, environmentSettingName) => {
    const selectedEnvironment: any = find(environmentsOptions, { name: environmentName })
    return selectedEnvironment.id
  })
  
  // Ask for input preferences from Fireadmin project based on template settings
  const inputSettings: ActionInputSetting[] = get(actionSettings, 'inputs', [])
  const inputQuestions = inputSettings.map((setting: any) => ({
    ...setting,
    message: `${setting.name} input`,
    type: 'input'
  }))
  const inputsByName = await prompt({}, inputQuestions)
  const inputValues: string[] = Object.values(inputsByName)
  
  // Run action steps
  const stepsSettings: any[] = get(actionSettings, 'steps', [])

  const transformStepsPromises: (Promise<CustomActionStepSetting | null>)[] = stepsSettings.map((actionStep, stepIndex) => {
    if (actionStep.type !== 'custom') {
      logError('Only custom actions are currently suppported') // eslint-disable-line no-console
      return Promise.resolve(null)
    }

    // Load migration file contents
    const migrationFilePath = `${actionParentPath}/${actionStep.filePath || 'index.js'}`
    if (!existsSync(migrationFilePath)) {
      logError(`File does not exist at provided path "${migrationFilePath}" skipping step ${stepIndex}`) // eslint-disable-line no-console
      return Promise.resolve(null)
    }

    return requireAsync(migrationFilePath).then((actionContents) => {
      const newActionRequest: CustomActionStepSetting = {
        type: 'custom',
        content: actionContents || '',
        filePath: migrationFilePath
      }
      return newActionRequest
    })
    // Call action passing environments, inputs, and previous step results
  }, [])

  const [transformErr, stepsResults] = await to(
    Promise.all(transformStepsPromises)
  )

  if (transformErr) {
    logError('Error transforming local action:', transformErr)
    throw transformErr
  }

  if (!stepsResults) {
    logError('No steps in transformed action:', actionSettings)
    throw new Error('No steps in transformed action')
  }

  const steps: any[] = stepsResults.filter((stepResult: CustomActionStepSetting | null) => !!stepResult)

  console.log('Local action settings:', { steps, environments: environmentResults, environmentValues, inputs: inputSettings, inputValues, projectId: project.id })

  return { steps, environments: environmentResults, environmentValues, inputs: inputSettings, inputValues, projectId: project.id }
}

/**
 * Run custom action based on user input
 */
export async function runCustomAction(): Promise<any> {
  const actionSettings = await getLocalActionSettings()
  return new ActionRequests().create(actionSettings)
}

export async function uploadCustomActionTemplateVersion() {
  // TODO: Upload custom action to fireadmin
  const actionSettings = await getLocalActionSettings()
  // return new ActionTemplates().create(actionSettings)
}
