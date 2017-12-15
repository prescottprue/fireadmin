import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import * as admin from 'firebase-admin'
import mkdirp from 'mkdirp-promise'
import GoogleAuth from 'google-auth-library'
import { encrypt } from '../utils/encryption'
const functions = require('firebase-functions')
const gcs = require('@google-cloud/storage')()
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

// TODO: Use firebase functions:config:set to configure your googleapi object:
// googleapi.client_id = Google API client ID,
// googleapi.client_secret = client secret, and
const CONFIG_CLIENT_ID = functions.config().googleapi.client_id
const CONFIG_CLIENT_SECRET = functions.config().googleapi.client_secret
const FUNCTIONS_REDIRECT = functions.config().googleapi.functions_redirect
const TOKEN_ENCRYPTION_PASSWORD = functions.config().googleapi
  .token_encryption_password
export const refreshEndpoint = 'https://www.googleapis.com/oauth2/v4/token'

// setup for authGoogleAPI
const SCOPES = []
const auth = new GoogleAuth()
const functionsOauthClient = new auth.OAuth2(
  CONFIG_CLIENT_ID,
  CONFIG_CLIENT_SECRET,
  FUNCTIONS_REDIRECT
)

// visit the URL for this Function to request tokens
export const authorizeGoogleApi = async (req, res) => {
  res.header('Access-Control-Allow-Origin', '*')
  return res.redirect(
    functionsOauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
      // The initial request contains a "state" query paremeter that contains the redirect URL
      // as well as the UID of the user making the request.  We need to pass this along so we
      // have access to this information in the response from the API Server (in oauthCallback)
      state: req.query.state
    })
  )
}

// after you grant access, you will be redirected to the URL for this Function
// this Function stores the tokens to your Firebase database
export const oauthCallback = async (req, res) => {
  const code = req.query.code
  // The state parameter contains two pieces of data in an object
  // state = { redirectUrl: 'urlhere', transactionOwnerId: 'uid' }
  console.log('req.query.state parsed', JSON.parse(req.query.state))
  const { redirectUrl, transactionOwnerId } = JSON.parse(req.query.state)
  functionsOauthClient.getToken(code, (err, tokens) => {
    // Now tokens contains an access_token and an optional refresh_token. Save them.
    // Tokens are in the form of
    // {
    //   access_token: $access_token,
    //   refresh_token: $refresh_token,
    //   expirty_date: $date,
    //   token_type: $type, // Bearer
    // }
    if (err) {
      res.status(400).send(err)
      return
    }
    const encryptedTokens = {
      ...tokens,
      access_token: encrypt(tokens.access_token, {
        password: TOKEN_ENCRYPTION_PASSWORD
      }),
      refresh_token: encrypt(tokens.refresh_token, {
        password: TOKEN_ENCRYPTION_PASSWORD
      })
    }
    const DB_TOKEN_PATH = `/secure/users/${transactionOwnerId}/googleContactsApi/`
    admin
      .database()
      .ref(DB_TOKEN_PATH)
      .set(encryptedTokens)
      .then(() => res.redirect(redirectUrl))
  })
}

const eventPathName = 'fileToDb'

/**
 * @name storageFileToRTDB
 * Convert a JSON file from storage bucket into a data on RTDB
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(copyFileToRTDB)

async function copyFileToRTDB(event) {
  const eventData = event.data.val()
  const { filePath, databasePath, keepPushKey = false } = eventData
  const tempLocalFile = path.join(os.tmpdir(), filePath)
  const tempLocalDir = path.dirname(tempLocalFile)
  await mkdirp(tempLocalDir)
  // Create Temporary directory and download file to that folder
  await bucket.file(filePath).download({ destination: tempLocalFile })
  // Read the file
  const fileData = await fs.readJson(filePath)
  console.log('File data loaded, writing to database', event.data.val())
  // Write File data to DB
  await event.data.adminRef.ref.root
    .child(`${databasePath}/${keepPushKey ? event.params.pushId : ''}`)
    .set(fileData)
  // Mark request as complete
  await event.data.adminRef.ref.root
    .child(`responses/${eventPathName}/${event.params.pushId}`)
    .set({
      completed: true,
      completedAt: admin.database.ServerValue.TIMESTAMP
    })
  console.log('Copying data to DB, cleaning up...')
  // Once the file data hase been added to db delete the local files to free up disk space.
  fs.unlinkSync(tempLocalFile)
  return filePath
}
