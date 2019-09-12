import { existsSync } from 'fs'
import { get, find } from 'lodash'
import {
  ActionEnvironmentSetting,
  ActionSettings,
  ActionInputSetting,
  CustomActionStepSetting
} from '@fireadmin/core/types/types/Action'
import { Projects, Project, ActionRequest, ActionTemplates, ActionTemplate } from '@fireadmin/core'
import { to } from './utils/async'
import { prompt } from './utils/prompt'
import { login } from './auth'
import {
  readDirPromise,
  readFilePromise,
  getLocalActionsFolder,
  requireAsync
} from './utils/files'

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
    console.log(`Error parsing action settings for action "${actionName}"`) // eslint-disable-line no-console
    return {}
  }
}

/**
 * Get local action settings by asking the user to select
 * the action.
 */
async function getLocalActionSettings(): Promise<ActionSettings> {
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
    console.log('Error getting projects', getErr) // eslint-disable-line no-console
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
    throw new Error('Project with matching name not found')
  }

  // Get environments of selected project
  const [getEnvsErr, environmentsOptions] = await to(project.getEnvironments())
  if (getEnvsErr) {
    console.log('Get envs error:', getEnvsErr) // eslint-disable-line no-console
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
  const environments = await prompt({}, environmentQuestions)

  // Ask for input preferences from Fireadmin project based on template settings
  const inputSettings: ActionInputSetting[] = get(actionSettings, 'inputs', [])
  const inputQuestions = inputSettings.map((setting: any) => ({
    ...setting,
    message: `${setting.name} input`,
    type: 'input'
  }))
  const inputs = await prompt({}, inputQuestions)

  // Run action steps
  const stepsSettings: any[] = get(actionSettings, 'steps', [])
  const transformStepsPromises: (Promise<CustomActionStepSetting>)[] = stepsSettings.reduce(async (acc, actionStep, stepIndex) => {
    if (actionStep.type !== 'custom') {
      console.log('Only custom actions are currently suppported') // eslint-disable-line no-console
      return acc
    }

    // Load migration file contents
    const migrationFilePath = `${actionParentPath}/${actionStep.filePath || 'index.js'}`
    if (!existsSync(migrationFilePath)) {
      console.log(`File does not exist at provided path "${migrationFilePath}" skipping step ${stepIndex}`) // eslint-disable-line no-console
      return acc
    }

    const actionContents = await requireAsync(migrationFilePath)
    if (!actionContents) {
      throw new Error('No action contents')
    }
    const newActionRequest: CustomActionStepSetting = {
      type: 'custom',
      content: actionContents,
      filePath: migrationFilePath
    }
    return acc.concat([newActionRequest])
    // Call action passing environments, inputs, and previous step results
  })
  
  const steps: CustomActionStepSetting[] = await Promise.all(transformStepsPromises)
  
  return { steps, environments, inputs }
}

/**
 * Run custom action based on user input
 */
export async function runCustomAction(): Promise<any> {
  const actionSettings = await getLocalActionSettings()
  return new ActionRequest().create(actionSettings)
}

export async function uploadCustomActionTemplateVersion(): Promise<ActionTemplate> {
  // TODO: Upload custom action to fireadmin
  const actionSettings = await getLocalActionSettings()
  return new ActionTemplates().create(actionSettings)
}
