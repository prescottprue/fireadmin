import ReactGA from 'react-ga'
import { version } from '../../package.json'
import { analyticsTrackingId, env } from 'config' // eslint-disable-line import/no-unresolved

/**
 * Initialize Google Analytics if analytics id exists and environment is
 * production
 */
export function initGA() {
  if (analyticsTrackingId && env === 'production') {
    ReactGA.initialize(analyticsTrackingId)
    ReactGA.set({
      appName: env || 'Production',
      appVersion: version
    })
  }
}

/**
 * Trigger analytics event within google analytics through react-ga
 * @param  {Object} eventData - Data associated with the event.
 */
export function triggerAnalyticsEvent(eventData) {
  if (analyticsTrackingId && env === 'production') {
    ReactGA.event(eventData)
  } else {
    console.debug('Analytics Event:', eventData) // eslint-disable-line no-console
  }
}

/**
 * Create event within project on Firestore
 * @param  {Object} firestore - firestore instance (from Firebase SDK)
 * @param  {String} projectId - Id of project document
 * @param  {Object} pushObject - data to push with event
 * @return {Promise} Resolves with results of firestore.add call
 */
export function createProjectEvent({ firestore, projectId }, pushObject) {
  return firestore.add(
    {
      collection: 'projects',
      doc: projectId,
      subcollections: [{ collection: 'events' }]
    },
    {
      ...pushObject,
      createdByType: 'user',
      createdAt: firestore.FieldValue.serverTimestamp()
    }
  )
}

/**
 * Set user auth data within Google Analytics
 * @param {Object} auth - Authentication data
 * @param {String} auth.uid - User's id
 */
export function setGAUser(auth) {
  if (auth && auth.uid) {
    ReactGA.set({ userId: auth.uid })
  }
}

/**
 * Track route update within Google Analytics
 */
export function trackRouteUpdate() {
  if (analyticsTrackingId) {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
}

export default { initGA, triggerAnalyticsEvent, trackRouteUpdate }
