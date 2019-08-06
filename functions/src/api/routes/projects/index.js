import express from 'express'
import { Projects } from '@fireadmin/core'
import { to } from 'utils/async'

const router = express.Router()

router.get('/', async (req, res) => {
  const [getErr, projects] = await to(new Projects().get())
  if (getErr) {
    console.error('Error getting projects', getErr)
    return res.status(500).send('Error getting projects')
  }
  res.json(projects)
})

router.post('/', async (req, res) => {
  console.log('Create project request:', req.body)
  const [createErr, newProject] = await to(new Projects().create(req.body))
  if (createErr) {
    console.error('Error creating project: ', createErr)
    return res.status(500).send('Error getting projects')
  }
  res.json(newProject)
})

export default router
