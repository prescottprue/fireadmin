#!/usr/bin/env node
/* eslint-disable no-console */
const { runCommand } = require('./utils')

/**
 * Assemble a `.firebaserc` file from the environment variables
 */
;(async () => {
  const defaultArgs = ['-m', 'cp']
  const { GCLOUD_PROJECT } = process.env
  const cacheFolderPath = 'functions_deploy_cache/current'
  const storagePath = `gs://${GCLOUD_PROJECT}.appspot.com/${cacheFolderPath}`
  const functionsPathsToCopy = ['src', 'index.js', 'package.json', 'yarn.lock']
  const functionsPath = 'functions'
  const commands = functionsPathsToCopy.map((pathToCopy) => {
    const newArgs = defaultArgs
    // Add recursive for folders
    if (!pathToCopy.includes('.')) {
      newArgs.push('-r')
    }
    return newArgs.concat([
      `${functionsPath}/${pathToCopy}`,
      `${storagePath}/${pathToCopy}`
    ])
  })
  try {
    await Promise.all(
      commands.map((commandArgs) => runCommand('gsutil', commandArgs))
    )
  } catch (err) {
    console.log('Error uploading cache', err)
  }
})()
