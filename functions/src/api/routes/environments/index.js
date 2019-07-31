import express from 'express'
import { Project } from '@fireadmin/core'
import { to } from 'utils/async'

const router = express.Router()

router.get('/', async (req, res) => {
  const requestBody = req.body
  if (!requestBody || !requestBody.project) {
    return res.status(500).send('Project is required to environments')
  }
  const [getErr, environments] = await to(
    new Project(requestBody.project).getEnvironments()
  )
  if (getErr) {
    console.error('Error getting environments', environments)
    return res.status(500).send('Error getting environments')
  }
  res.json(environments)
})

export default router
