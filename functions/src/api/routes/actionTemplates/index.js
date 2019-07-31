import express from 'express'
import { ActionTemplates } from '@fireadmin/core'
import { to } from 'utils/async'

const router = express.Router()

// Action templates page
router.get('/', async (req, res) => {
  const [getErr, actionTemplates] = await to(new ActionTemplates().get())
  if (getErr) {
    console.error('Error getting actionTemplates', getErr)
    return res.status(500).send('Error getting actionTemplates')
  }
  res.json(actionTemplates)
})

export default router
