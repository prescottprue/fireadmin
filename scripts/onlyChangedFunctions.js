#!/usr/bin/env node
/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')

/**
 * Assemble a `.firebaserc` file from the environment variables
 */
;(() => {
  const stdinBuffer = fs.readFileSync(0) // STDIN_FILENO = 0
  const input = stdinBuffer.toString()

  const inputLines = input.split('\n').filter(Boolean)
  const foldersToIgnore = ['utils', 'constants']

  const inputPathNames = inputLines.map((currentFilePath) =>
    path.basename(path.dirname(currentFilePath))
  )
  const inputIncludesIgnoredPaths = inputPathNames.find((pathName) =>
    foldersToIgnore.includes(pathName)
  )
  // Deploy all functions if ignored paths are
  if (inputIncludesIgnoredPaths) {
    console.log('firebase deploy --only functions')
    return
  }

  const deployPathNames = inputPathNames.filter(
    (folderPath) => !foldersToIgnore.includes(folderPath)
  )
  const uniqueDeployPathNames = [...new Set(deployPathNames)]

  // Skip deploying of functions if nothing changed
  if (!uniqueDeployPathNames.length) {
    // console.log('firebase deploy --except functions')
    return
  }
  // log deploy command
  const functionsStrings = uniqueDeployPathNames
    .map((pathName) => `functions:${pathName}`)
    .join(',')
  const deployString = `firebase deploy --only ${functionsStrings}`
  console.log(deployString)
})()
