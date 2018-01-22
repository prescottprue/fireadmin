const functions = require('firebase-functions')
const admin = require('firebase-admin')
const storageFileToRTDB = require('./dist/storageFileToRTDB').default
const actionRunner = require('./dist/actionRunner').default
const indexUsers = require('./dist/search').indexUsers
const callGoogleApi = require('./dist/callGoogleApi').default
const sendInvite = require('./dist/invites').sendInvite
const indexActionTemplates = require('./dist/search').indexActionTemplates
const copyServiceAccountToFirestore = require('./dist/copyServiceAccountToFirestore')
  .default

admin.initializeApp(functions.config().firebase)

exports.actionRunner = actionRunner
exports.copyServiceAccountToFirestore = copyServiceAccountToFirestore
exports.storageFileToRTDB = storageFileToRTDB
exports.indexUsers = indexUsers
exports.callGoogleApi = callGoogleApi
exports.indexActionTemplates = indexActionTemplates
exports.sendInvite = sendInvite
