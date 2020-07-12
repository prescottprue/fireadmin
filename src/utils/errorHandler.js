import * as Sentry from '@sentry/browser'
import StackdriverErrorReporter from 'stackdriver-errors-js'
import { version } from '../../package.json'

let errorHandler // eslint-disable-line import/no-mutable-exports

/**
 * Initialize Stackdriver Error Reporter only if api key exists
 */
function initStackdriverErrorReporter() {
  try {
    const errorHandler = new StackdriverErrorReporter()
    errorHandler.start({
      key: process.env.REACT_APP_FIREBASE_apiKey,
      projectId: process.env.REACT_APP_FIREBASE_projectId,
      service: 'fireadmin-site',
      version
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(
      'Error setting up stackdriver client side error reporting',
      err
    )
  }
}

/**
 * Initialize Sentry (reports to sentry.io)
 */
function initSentry() {
  if (process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.REACT_APP_FIREADMIN_ENV || 'local',
      release: version
    })
  }
}

/**
 * Initialize client side error reporting. Error handling is only
 * initialized if in production environment.
 */
export function init() {
  if (!window.location.origin.includes('localhost') && !window.Cypress) {
    initStackdriverErrorReporter()
    initSentry()
  } else {
    errorHandler = console.error // eslint-disable-line no-console
  }
}

/**
 * Set user's uid within error reporting context (can be one or
 * many error handling utilities)
 * @param {Object} user - Authentication data
 * @param {String} user.uid - User's id
 */
export function setErrorUser(user) {
  if (user?.uid && !window.location.origin.includes('localhost')) {
    // Set user within Stackdriver
    if (errorHandler?.setUser) {
      errorHandler.setUser(user.uid)
    }
    // Set user within Sentry
    Sentry.configureScope((scope) => {
      scope.setUser({
        id: user.uid,
        email: user.email || 'none'
      })
    })
  }
}

export default errorHandler
