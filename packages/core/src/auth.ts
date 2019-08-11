import { initializeFirebase, getApp } from './utils/firebase'

export async function loginWithApiKey(apiKey: string) {
  try {
    initializeFirebase()
  } catch(err) {
    console.log('Error initializing firebase', err)
    throw err
  }
  // Return current user if they are already logged in
  const currentUser = getApp().auth().currentUser
  if (currentUser) {
    return currentUser
  }
  // Call generateAuthToken cloud function to get customToken from API Key
  const tokenRes = await getApp().functions().httpsCallable('generateAuthToken')({ token: apiKey })
  // Sign in with new custom token
  return getApp().auth().signInWithCustomToken(tokenRes.data);
}