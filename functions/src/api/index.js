import * as functions from 'firebase-functions'
import express from 'express'
import environments from './routes/environments'
import projects from './routes/projects'
import actionTemplates from './routes/actionTemplates'
import { validateApiRequest } from 'utils/firebaseFunctions'

/* Express */
const apiApp = express()
apiApp.use(validateApiRequest)
apiApp.use('/environments', environments)
apiApp.use('/projects', projects)
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
