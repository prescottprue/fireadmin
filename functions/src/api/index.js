import * as functions from 'firebase-functions'
import express from 'express'
import environments from './routes/environments'
import actionTemplates from './routes/actionTemplates'

/* Express */
const apiApp = express()
apiApp.use('/environments', environments)
apiApp.use('/actionTemplates', actionTemplates)

apiApp.get('*', (request, response) => {
  response.status(404).send('Not found!')
})

/**
 * @name api
 * Cloud Function triggered by call to /api
 * @type {functions.CloudFunction}
 */
export default functions.https.onRequest(apiApp)
