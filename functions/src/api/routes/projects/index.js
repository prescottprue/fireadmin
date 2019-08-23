import admin from 'firebase-admin'
import express from 'express'
import { Projects } from '@fireadmin/core'
import { to } from 'utils/async'
import { getEnvironmentsFromProjectRef } from 'utils/environments'
import { PROJECTS_COLLECTION } from '@fireadmin/core/lib/constants/firestorePaths'

const router = express.Router()

router.get('/', async (req, res) => {
  const [getErr, projects] = await to(new Projects().get())
  if (getErr) {
    console.error('Error getting projects', getErr)
    return res.status(500).send('Error getting projects')
  }
  res.json(projects)
})

router.get('/:projectId/environments', async (req, res) => {
  console.log('req.params', req.params)
  const { projectId } = req.params
  if (!projectId) {
    return res.status(500).send('Project is required to environments')
  }
  console.log('Get environments request', { projectId, user: req.user })

  // Get environments of found project
  const [getEnvironmentsErr, environments] = await to(
    getEnvironmentsFromProjectRef(
      admin
        .firestore()
        .collection(PROJECTS_COLLECTION)
        .doc(projectId)
    )
  )

  if (getEnvironmentsErr) {
    console.error(
      `Error getting project environments for project with id "${projectId}"`
    )
    return res.status(500).send('Internal error')
  }

  return res.json(environments)
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
