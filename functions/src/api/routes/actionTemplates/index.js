import express from 'express'
import * as admin from 'firebase-admin'

const router = express.Router()

// Action templates page
router.get('/', async (req, res) => {
  const templatesSnap = await admin
    .firestore()
    .collection('actionTemplates')
    .get()
  const templates = []
  templatesSnap.forEach(snap => {
    templates.push(snap.data())
  })
  res.json(templates)
})

export default router
