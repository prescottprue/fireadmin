import { existsSync } from 'fs'
import { get, find } from 'lodash'
import { ActionEnvironmentSetting, ActionSettings, ActionStepSetting, ActionInputSetting } from '@fireadmin/core/types/types/Action'
import { Projects, Project } from '@fireadmin/core'
import { promiseWaterfall, to } from './utils/async'
import { prompt } from './utils/prompt'
import { login } from './auth'
import { readDirPromise, readFilePromise, getLocalActionsFolder, requireAsync } from './utils/files'

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

async function getActionSettings(actionName: string): Promise<ActionSettings> {
  const localActionsFolder = getLocalActionsFolder()
  const actionParentPath = `${localActionsFolder}/${actionName}`
  const actionSettingsPath = `${actionParentPath}/settings.json`
  const actionSettingsString: Buffer = await readFilePromise(actionSettingsPath)
  try {
    return JSON.parse(actionSettingsString.toString())
  } catch(err) {
    console.log(`Error parsing action settings for action "${actionName}"`)
    return {}
  }
}

export async function runCustomAction() {
  // Load actions from current folder and run it by passing in environments (selected by user based on migration settings)
  const localActions = await getLocalActions()
  const actionChoices = localActions.map((actionName) => ({
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
  const localActionsFolder = getLocalActionsFolder()
  const actionSettings = await getActionSettings(optionAnswer[SELECTED_ACTION_PROMPT_NAME])
  const actionParentPath = `${localActionsFolder}/${optionAnswer[SELECTED_ACTION_PROMPT_NAME]}`
  const environmentSettings: ActionEnvironmentSetting[] = get(actionSettings, 'environments', [])
  await login()
  // Get List of projects (to provide options to use)
  const [getErr, projectsList] = await to(new Projects().get())
  if (getErr) {
    console.log('Error getting projects', getErr)
    throw getErr
  }
  const SELECTED_PROJECT_PROMPT_NAME = 'projectName'
  // Prompt use to select project
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
  const [getEnvsErr, environments] = await to(project.getEnvironments())
  if (getEnvsErr) {
    console.log('Get envs error:', getEnvsErr)
    throw getEnvsErr
  }

  // Ask for environment preferences from Fireadmin project based on template settings
  const environmentQuestions: any[] = environmentSettings.map((setting: ActionEnvironmentSetting) => ({
    ...setting,
    message: `${setting.name} environment`,
    type: 'list',
    choices: environments
  }))
  const environmentsAnswers = await prompt({}, environmentQuestions)

  // Ask for input preferences from Fireadmin project based on template settings
  const inputSettings: ActionInputSetting[] = get(actionSettings, 'inputs', [])
  const inputQuestions = inputSettings.map((setting: any) => ({
    ...setting,
    message: `${setting.name} input`,
    type: 'input'
  }))
  const inputsAnswers = await prompt({}, inputQuestions)

  // Run action steps
  const actionSteps: any[] = get(actionSettings, 'steps', [])
  const actionFunctions = actionSteps.map((actionStep: ActionStepSetting) => {
    if (actionStep.type !== 'custom') {
      console.log('Only custom actions are currently suppported')
      return null
    }
    const filePath = `${actionParentPath}/${actionStep.filePath || 'index.js'}`
    if (!existsSync(filePath)) {
      console.log('File does not exist at provided path')
      return null
    }
    try {
      // Call action passing environments, inputs, and previous step results
      return async (previousStep: any) => {
        const actionContents: any = await requireAsync(filePath)
        return actionContents(environmentsAnswers, inputsAnswers, previousStep)
      }
    } catch(err) {
      console.log('Error trying to load action:', err)
      return (previousResults: any) => err
    }
  })
  const results = await promiseWaterfall(actionFunctions)
  console.log('Action completed successfully!', results) // eslint-disable-line no-console
}

export async function uploadAction() {
  // TODO: Upload custom action to fireadmin
}
