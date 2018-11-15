#!/usr/bin/env node
/* eslint-disable no-console */
const isString = require('lodash/isString')
const fs = require('fs')
const path = require('path')
const yargs = require('yargs') // eslint-disable-line import/no-extraneous-dependencies
const drop = require('lodash/drop')
const utils = require('../build/lib/utils')
const config = require('../project.config')

/**
 * Create data object with values for each document with keys being doc.id.
 * @param  {firebase.database.DataSnapshot} snapshot - Data for which to create
 * an ordered array.
 * @return {Object|Null} Object documents from snapshot or null
 */
function dataArrayFromSnap(snap) {
  const data = []
  if (snap.data && snap.exists) {
    data.push({ id: snap.id, data: snap.data() })
  } else if (snap.forEach) {
    snap.forEach(doc => {
      data.push({ id: doc.id, data: doc.data() || doc })
    })
  }
  return data
}

/**
 * Load fixture and parse into JSON
 * @param {String} fixturePath - Fixture's path from root
 */
function readJsonFixture(fixturePath) {
  const fixtureString = fs.readFileSync(fixturePath)
  try {
    return JSON.parse(fixtureString)
  } catch (err) {
    console.error(`Error reading JSON fixture at path: ${fixturePath}`)
    throw err
  }
}

/**
 * Read fixture file provided relative path
 * @param {String} fixturePath - Relative path of fixture file
 */
function readFixture(fixturePath) {
  const fixturesPath = path.join(config.basePath, config.e2eTestDir, 'fixtures')
  // Confirm fixture exists
  const pathToFixtureFile = path.join(fixturesPath, fixturePath)

  if (!fs.existsSync(pathToFixtureFile)) {
    throw new Error(`Fixture not found at path: ${fixturesPath}`)
  }
  const fixtureFileExtension = path.extname(fixturePath)
  switch (fixtureFileExtension) {
    case '.json':
      return readJsonFixture(pathToFixtureFile)
    default:
      return fs.readFileSync(pathToFixtureFile)
  }
}

/**
 * Parse fixture path string into JSON otherwise returns the original string
 * @param {String} unparsed - Unparsed string to be parsed into JSON
 */
function parseFixturePath(unparsed) {
  if (isString(unparsed)) {
    try {
      return JSON.parse(unparsed)
    } catch (err) {
      return unparsed
    }
  }
  return unparsed
}

/**
 *
 * @param {String} action - Firestore action to run
 * @param {String} actionPath - Path at which Firestore action should be run
 * @param {String} thirdArg - Either path to fixture or string containing object
 * of options (parsed by cy.callFirestore custom Cypress command)
 * @param {String} withMeta -
 */
function firestoreAction(originalArgv, action = 'set', actionPath, thirdArg) {
  const fbInstance = utils.initializeFirebase()

  let options = {}
  const parsedVal = parseFixturePath(thirdArg)

  // Otherwise handle third argument as an options object
  options = parsedVal

  // Create ref from slash and any provided query options
  const ref = utils.slashPathToFirestoreRef(
    fbInstance.firestore(),
    actionPath,
    options
  )

  // Confirm ref has action as a method
  if (typeof ref[action] !== 'function') {
    const missingActionErr = `Ref at provided path "${actionPath}" does not have action "${action}"`
    throw new Error(missingActionErr)
  }

  try {
    // Call action with fixture data
    return ref[action](parsedVal)
      .then(res => {
        const dataArray = dataArrayFromSnap(res)

        // Write results to stdout to be loaded in tests
        if (action === 'get') {
          process.stdout.write(JSON.stringify(dataArray))
        }

        return dataArray
      })
      .catch(err => {
        console.log(`Error with ${action} at path "${actionPath}": `, err)
        return Promise.reject(err)
      })
  } catch (err) {
    console.log(`${action} at path "${actionPath}" threw an error: `, err)
    throw err
  }
}

const commands = [
  {
    command: 'firestore [action] [actionPath] [fixturePath]',
    describe: 'run action on Firebase using service account',
    builder: yargsInstance => {
      yargsInstance.positional('action', {
        describe: 'action to run on Firestore',
        default: 'set'
      })
      yargsInstance.positional('actionPath', {
        describe: 'path of action to run on Firestore',
        default: 'projects/test-project'
      })
      yargsInstance.positional('fixturePath', {
        describe: 'path of fixture to use ',
        default: 'fakeProject.json'
      })
    },
    handler: argv => {
      // Log if verbose option is passed
      if (argv.verbose) {
        console.info(
          `firestore command on :${argv.action} at ${argv.actionPath}`
        )
      }
      return argv
    }
  }
]
;(function runFirebaseExtra() {
  // eslint-disable-line consistent-return
  let currentArgs
  try {
    // TODO: Replace with commandDir when moving config to a directory
    for (const command in commands) {
      // eslint-disable-line guard-for-in, no-restricted-syntax
      currentArgs = yargs.command(command)
    }
    yargs.option('withMeta', {
      alias: 'm',
      default: false
    })
    /* eslint-disable no-unused-expressions */
    const argv = currentArgs.option('verbose', {
      alias: 'v',
      default: false
    }).argv
    return firestoreAction(argv, ...drop(argv._))
    /* eslint-enable no-unused-expressions */
  } catch (err) {
    /* eslint-disable no-console */
    console.error(`Error running firebase action: ${err.message || 'Error'}`)
    /* eslint-enable no-console */
    process.exit(1)
  }
})()
