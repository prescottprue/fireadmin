'use strict'

import * as admin from 'firebase-admin'
const functions = require('firebase-functions')
const bigquery = require('@google-cloud/bigquery')()

/**
 * Writes all logs from the Realtime Database into bigquery.
 */
exports.logSystemEvent = functions.database
  .ref('/requests/logSystemEvent/{logid}')
  .onCreate(event => {
    // TODO: Make sure you set the `bigquery.datasetName` Google Cloud environment variable.
    const dataset = bigquery.dataset(functions.config().bigquery.dataset)
    const table = dataset.table(event.data.val().table || 'MISC')
    const eventData = event.data.val()
    return table
      .insert({
        ID: event.data.key,
        type: eventData.type,
        createdBy: eventData.createdBy,
        timestamp: bigquery.datetime('2017-01-01 13:00:00') // replace with moment(createdAt).format('YYYY-[M]M-[D]D[ [H]H:[M]M:[S]S[.DDDDDD]]')
      })
      .then(() =>
        event.data.adminRef.update({
          complete: true,
          completedAt: admin.database.ServerValue.TIMESTAMP
        })
      )
      .catch(err => {
        console.error('errors:', err.errors)
        return Promise.reject(err)
      })
  })
