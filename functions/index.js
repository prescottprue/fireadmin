const functions = require('firebase-functions')
const admin = require('firebase-admin')
const storageFileToRTDB = require('./dist/storageFileToRTDB').default
const dataMigration = require('./dist/dataMigration').default
const indexentry = require('./dist/search').indexentry
const logSystemEvent = require('./dist/logSystemEvent').logSystemEvent
const copyServiceAccountToFirestore = require('./dist/copyServiceAccountToFirestore')
  .default

admin.initializeApp(functions.config().firebase)

exports.logSystemEvent = logSystemEvent
exports.dataMigration = dataMigration
exports.copyServiceAccountToFirestore = copyServiceAccountToFirestore
exports.storageFileToRTDB = storageFileToRTDB
exports.indexentry = indexentry
