// import fs from 'fs-extra'
// import os from 'os'
// import path from 'path'
// import * as admin from 'firebase-admin'
// import mkdirp from 'mkdirp-promise'
import request from 'request-promise'
const functions = require('firebase-functions')
// const gcs = require('@google-cloud/storage')()
// const bucket = gcs.bucket(functions.config().firebase.storageBucket)

const eventPathName = 'storageApi'

/**
 * @name storageFileToRTDB
 * Convert a JSON file from storage bucket into a data on RTDB
 * @type {functions.CloudFunction}
 */
export default functions.database
  .ref(`/requests/${eventPathName}/{pushId}`)
  .onCreate(callStorageApi)

async function callStorageApi(event) {
  const {
    api = 'storage',
    body,
    suffix = `b/${functions.config().firebase.storageBucket}`
  } = event
  return request({
    method: 'PUT',
    uri: `https://www.googleapis.com/${api}/v1/${suffix}`,
    body,
    json: true
  })
}
