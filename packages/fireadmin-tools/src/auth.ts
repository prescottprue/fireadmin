import { loginWithApiKey } from '@fireadmin/core'
import { prompt } from './utils/prompt'
import { to } from './utils/async'
import configstore from './utils/configstore'
import { error as logError } from './logger'

const API_KEY_CONFIGSTORE_KEY = 'apiKey'
const UID_CONFIGSTORE_KEY = 'uid'

/**
 * Ask user for Fireadmin API Key
 */
async function askForApiKey(): Promise<string> {
  const API_KEY_PROMPT_NAME = 'apiKeyPrompt'
  const [err, optionAnswer] = await to(
    prompt({}, [
      {
        type: 'input',
        name: API_KEY_PROMPT_NAME,
        message: 'Paste API Key generated on fireadmin.io'
      }
    ])
  )
  if (err) {
    logError('Error prompting for token', err) // eslint-disable-line no-console
    throw err
  }
  const token = optionAnswer[API_KEY_PROMPT_NAME]

  // Save API Key within file specific to fireadmin-tools
  configstore.set(API_KEY_CONFIGSTORE_KEY, token)

  return token
}

/**
 * Ask user for Fireadmin UID
 */
async function askForUid(): Promise<string> {
  const UID_PROMPT_NAME = 'uidPrompt'
  const [err, optionAnswer] = await to(
    prompt({}, [
      {
        type: 'input',
        name: UID_PROMPT_NAME,
        message: 'Paste Your UID from fireadmin.io'
      }
    ])
  )

  if (err) {
    logError('Error prompting for token', err) // eslint-disable-line no-console
    throw err
  }

  const apiKey = optionAnswer[UID_PROMPT_NAME]

  // Save API Key within file specific to fireadmin-tools
  configstore.set(UID_CONFIGSTORE_KEY, apiKey)

  return apiKey
}

async function getApiKey(): Promise<string> {
  const apiKey = configstore.get(API_KEY_CONFIGSTORE_KEY)
  if (apiKey) {
    return apiKey
  }
  return askForApiKey()
}

async function getUid(): Promise<string> {
  const uid = configstore.get(UID_CONFIGSTORE_KEY)
  if (uid) {
    return uid
  }
  return askForUid()
}

export async function login() {
  // TODO: In the future look into calling endpoint to auth with google - check firebase-tools for reference
  const uid = await getUid()
  const apiKey = await getApiKey()
  const [loginErr] = await to(loginWithApiKey(apiKey, uid))
  if (loginErr) {
    logError('Error logging in:', loginErr.message) // eslint-disable-line no-console
    throw loginErr
  }
}
