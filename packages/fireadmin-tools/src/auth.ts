import { loginWithToken } from '@fireadmin/core'
import { get, isEmpty } from 'lodash'
import { prompt } from './utils/prompt'
import { to } from './utils/async';
import configstore from './utils/configstore'

const TOKEN_CONFIGSTORE_KEY = 'token'

async function askForToken(): Promise<string> {
  const TOKEN_PROMPT_NAME = 'tokenPrompt'
  const [err, optionAnswer] = await to(
    prompt({}, [
      {
        type: 'input',
        name: TOKEN_PROMPT_NAME,
        message: 'Please enter custom token generated on fireadmin.io'
      }
    ])
  )
  if (err) {
    console.log('Error prompting for token', err)
    throw err
  }
  const token = optionAnswer[TOKEN_PROMPT_NAME]

  // Save token within file specific to fireadmin-tools
  configstore.set(TOKEN_CONFIGSTORE_KEY, token)

  return token
}

async function getAccessToken() {
  const token = configstore.get(TOKEN_CONFIGSTORE_KEY)
  if (token) {
    console.log('Token loaded', typeof token)
    return token
  }
  return askForToken()
}

export async function login() {
  // TODO: In the future look into calling endpoint to auth with google - check firebase-tools for reference
  const token = await getAccessToken()
  const [loginErr] = await to(loginWithToken(token))
  if (loginErr) {
    console.log('Error logging in:', loginErr.message)
    throw loginErr
  }
}