import { version } from '../../package.json'
import { firebase, googleApis, sentryDsn, env as environment } from '../config'

let errorHandler

/**
 * Initialize Raven
 */
function initRaven() {
  if (sentryDsn && Raven) {
    Raven.config(sentryDsn, {
      environment,
      release: version
    }).install()
  }
}

/**
 * Initialize Stackdriver Error Reporter only if api key exists
 */
function initStackdriverErrorReporter() {
  let errorReporter
  if (googleApis && googleApis.apiKey && window.StackdriverErrorReporter) {
    window.addEventListener('DOMContentLoaded', () => {
      const errorHandler = new window.StackdriverErrorReporter()
      errorHandler.start({
        key: googleApis.apiKey,
        projectId: firebase.projectId,
        service: 'fireadmin-site',
        version
      })
    })
  }
  return errorReporter
}

/**
 * Initialize client side error reporting. Error handling is only
 * initialized if in production environment.
 */
export function init() {
  if (environment === 'production' || environment === 'stage') {
    initRaven()
    initStackdriverErrorReporter()
  } else {
    errorHandler = console.error // eslint-disable-line no-console
  }
  return errorHandler
}

/**
 * Set user's uid within Stackdriver error reporting context
 * @param {Object} auth - Authentication data
 * @param {String} auth.uid - User's id
 */
export function setErrorUser(auth) {
  if (
    auth &&
    auth.uid &&
    (environment === 'production' || environment === 'stage')
  ) {
    // Set user within Stackdriver
    if (errorHandler && errorHandler.setUser) {
      errorHandler.setUser(auth.uid)
    }
    // Set user within Raven (so it will show in Sentry)
    if (Raven && Raven.setUserContext) {
      Raven.setUserContext({
        id: auth.uid,
        email: auth.email || 'none'
      })
    }
  }
}
