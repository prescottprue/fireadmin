import express from 'express'
// import * as admin from 'firebase-admin'

const router = express.Router()

// Home page route.
router.get('/', async (req, res) => {
  // await admin.firestore().collection('projects')
  res.send('Not set up')
})

export default router
