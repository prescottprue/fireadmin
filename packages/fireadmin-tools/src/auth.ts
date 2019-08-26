import { loginWithApiKey } from '@fireadmin/core'
import { prompt } from './utils/prompt'
import { to } from './utils/async'
import configstore from './utils/configstore'

const API_KEY_CONFIGSTORE_KEY = 'apiKey'

async function askForApiKey(): Promise<string> {
  const TOKEN_PROMPT_NAME = 'tokenPrompt'
  const [err, optionAnswer] = await to(
    prompt({}, [
      {
        type: 'input',
        name: TOKEN_PROMPT_NAME,
        message: 'Paste API Key generated on fireadmin.io'
      }
    ])
  )
  if (err) {
    console.log('Error prompting for token', err) // eslint-disable-line no-console
    throw err
  }
  const token = optionAnswer[TOKEN_PROMPT_NAME]

  // Save API Key within file specific to fireadmin-tools
  configstore.set(API_KEY_CONFIGSTORE_KEY, token)

  return token
}

async function askForUid(): Promise<string> {
  const TOKEN_PROMPT_NAME = 'uid'
  const [err, optionAnswer] = await to(
    prompt({}, [
      {
        type: 'input',
        name: TOKEN_PROMPT_NAME,
        message: 'Paste Your UID from fireadmin.io'
      }
    ])
  )
  if (err) {
    console.log('Error prompting for token', err) // eslint-disable-line no-console
    throw err
  }
  const token = optionAnswer[TOKEN_PROMPT_NAME]

  // Save API Key within file specific to fireadmin-tools
  configstore.set(API_KEY_CONFIGSTORE_KEY, token)

  return token
}

async function getApiKey() {
  const token = configstore.get(API_KEY_CONFIGSTORE_KEY)
  if (token) {
    return token
  }
  return askForApiKey()
}

export async function login() {
  // TODO: In the future look into calling endpoint to auth with google - check firebase-tools for reference
  const apiKey = await getApiKey()
  const uid = await askForUid()
  const [loginErr] = await to(loginWithApiKey(apiKey, uid))
  if (loginErr) {
    console.log('Error logging in:', loginErr.message) // eslint-disable-line no-console
    throw loginErr
  }
}
