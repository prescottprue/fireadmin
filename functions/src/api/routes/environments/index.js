import express from 'express'
import { to } from 'utils/async'
import {
  getProjectByName,
  getEnvironmentsFromProjectRef
} from 'utils/environments'

const router = express.Router()

router.get('/', async (req, res) => {
  const requestBody = req.body
  if (!requestBody || (!requestBody.project && !requestBody.projectName)) {
    return res.status(500).send('Project is required to environments')
  }
  console.log('Get environments request', requestBody)

  // Get project by name
  const [getProjectErr, firstProject] = await to(
    getProjectByName(requestBody.projectName || requestBody.project)
  )

  if (getProjectErr) {
    if (getProjectErr.message.includes('not found')) {
      console.error(`Project with name "${requestBody.projectName}" not found`)
      return res.status(401).send('Project not found')
    }
    console.error(
      `Error getting project with name "${requestBody.projectName ||
        requestBody.project}"`,
      getProjectErr
    )
    return res.status(500).send('Internal error')
  }

  // Get environments of found project
  const [getEnvironmentsErr, environments] = await to(
    getEnvironmentsFromProjectRef(firstProject.ref)
  )

  if (getEnvironmentsErr) {
    console.error(
      `Error getting project environments for project with name "${
        requestBody.projectName
      }"`
    )
    return res.status(500).send('Internal error')
  }

  return res.json(environments)
})

export default router
