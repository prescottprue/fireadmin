import * as admin from 'firebase-admin';
import { initialize, loginWithToken } from '@fireadmin/core'
import { prompt } from './utils/prompt'
import { to } from './utils/async';

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
  return optionAnswer[TOKEN_PROMPT_NAME]
}

export async function login() {
  // TODO: Instruct user to generate token within UI of Fireadmin and enter it
  // TODO: Save token within file specific to
  // TODO: In the future look into calling endpoint to auth with google - check firebase-tools for reference
  // const fireadminApp = firebase.initializeApp({
  //   credential: admin.credential.refreshToken(refreshToken),
  //   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  // })
  // initialize(fireadminApp)
  const token = await askForToken()
  await loginWithToken(token)
}