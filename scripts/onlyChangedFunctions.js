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
  if (inputIncludesIgnoredPaths) {
    console.log('firebase deploy --only functions')
    return
  }

  const deployPathNames = inputPathNames.filter(
    (folderPath) => !foldersToIgnore.includes(folderPath)
  )
  // Filter all file changes into function folders which were modified
  // const foldersMap = inputLines.reduce((acc, currentFilePath) => {
  //   const functionFolderName = path.basename(path.dirname(currentFilePath))
  //   // Ignore folder if it is in the ignored folders list
  //   if (foldersToIgnore.includes(functionFolderName)) {
  //     return acc
  //   }
  //   // Otherwise add to folder names map (handles duplicates)
  //   return {
  //     ...acc,
  //     [functionFolderName]: true
  //   }
  // }, {})
  // const foldersToDeploy = Object.keys(foldersMap)
  const functionsStrings = deployPathNames
    .map((pathName) => `functions:${pathName}`)
    .join(',')
  const deployString = `firebase deploy --only ${functionsStrings}`
  console.log(deployString)
})()
