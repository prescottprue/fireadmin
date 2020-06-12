#!/usr/bin/env node
/* eslint-disable no-console */
const { runCommand } = require('./utils')

/**
 * Assemble a `.firebaserc` file from the environment variables
 */
;(async () => {
  const { GCLOUD_PROJECT, STORAGE_BUCKET } = process.env
  const storageBucketUrl = STORAGE_BUCKET
    ? `gs://${STORAGE_BUCKET}`
    : `gs://${GCLOUD_PROJECT}.appspot.com`
  console.log('storage bucket:', storageBucketUrl)
  const functionCacheFolder = 'functions_cache'
  const localCacheFolder = 'local_functions_cache'
  try {
    await runCommand('mkdir', ['-p', `${localCacheFolder}/`])
    await runCommand('gsutil', [
      '-m',
      'cp',
      '-r',
      `${storageBucketUrl}/${functionCacheFolder}`,
      `${localCacheFolder}/`
    ])
  } catch (err) {
    console.log('Error uploading cache', err)
  }
})()
