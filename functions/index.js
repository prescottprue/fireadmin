/* eslint-disable no-console */
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const path = require('path')
const os = require('os')
const fs = require('fs')
const mkdirp = require('mkdirp-promise')
const gcs = require('@google-cloud/storage')()
const mainApp = admin.initializeApp(functions.config().firebase)
const bucket = gcs.bucket(functions.config().firebase.storageBucket)

exports.testMigration = functions.database
  .ref('/requests/migration/{pushId}')
  .onCreate(event => {
    console.log('Running migration', event.data.val())
    const eventData = event.data.val()
    const filePath = eventData.serviceAccount
    const tempLocalFile = path.join(os.tmpdir(), filePath)
    const tempLocalDir = path.dirname(tempLocalFile)
    // Create Temporary directory
    return (
      mkdirp(tempLocalDir)
        // Download file from bucket
        .then(() =>
          bucket.file(filePath).download({ destination: tempLocalFile })
        )
        .then(() => {
          const secondApp = admin.initializeApp(
            {
              credential: admin.credential.cert(tempLocalFile),
              databaseURL: eventData.databaseURL
            },
            'app2'
          )
          const copyPath = eventData.copyPath || 'projects'
          console.log('initialize completed, copying data in ', copyPath)
          return mainApp
            .database()
            .ref(copyPath)
            .once('value')
            .then(snap =>
              secondApp
                .database()
                .ref(copyPath)
                .set(snap.val())
            )
        })
        .then(() =>
          event.data.adminRef.ref.root
            .child(`responses/migration/${event.params.pushId}`)
            .set({
              completed: true,
              completedAt: admin.database.ServerValue.TIMESTAMP
            })
        )
        .then(() => {
          console.log('Finished, migrating data, Cleaning up...')
          // Once the image has been uploaded delete the local files to free up disk space.
          fs.unlinkSync(tempLocalFile)
          return filePath
        })
        .catch(err => {
          console.log(
            'Error running migration:',
            err.toString ? err.toString() : err
          )
          return Promise.reject(err)
        })
    )
  })
