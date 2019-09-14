import { initializeFirebase, getApp } from './utils/firebase'
import { to } from './utils/async'

export async function loginWithApiKey(apiKey: string, uid: string) {
  try {
    initializeFirebase()
  } catch (err) {
    console.error('Error initializing firebase', err) // eslint-disable-line no-console
    throw err
  }

  // Return current user if they are already logged in
  const currentUser = getApp().auth().currentUser
  if (currentUser) {
    return currentUser
  }

  if (!uid) {
    throw new Error('uid is required to Login With API Key')
  }

  // Call generateAuthToken cloud function to get customToken from API Key
  const [tokenErr, tokenRes] = await to(
    getApp()
    .functions()
    .httpsCallable('generateAuthToken')({ apiKey, uid })
  )

  if (tokenErr) {
    console.error('Error generating auth token for Fireadmin API', tokenErr) // eslint-disable-line no-console
    throw tokenErr
  }

  if (!tokenRes || !tokenRes.data) {
    const missingTokenMsg = 'Token does not exist within response'
    console.error(missingTokenMsg) // eslint-disable-line no-console
    throw new Error(missingTokenMsg)
  }

  // Sign in with new custom token
  const [loginErr, loginRes] = await to(
    getApp()
      .auth()
      .signInWithCustomToken(tokenRes.data.token)
  )

  if (loginErr) {
    /* eslint-disable */
    console.error(
      'Error logging in using custom token generated from API Key',
      loginErr
    )
    /* eslint-enable */
    throw loginErr
  }

  return { token: tokenRes.data.token, ...loginRes }
}
