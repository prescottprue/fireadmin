import ReactGA from 'react-ga'
import { version } from '../../package.json'
import { analyticsTrackingId, env } from 'config' // eslint-disable-line import/no-unresolved

// Initialize Google Analytics
export const initGA = () => {
  if (analyticsTrackingId && env === 'production') {
    ReactGA.initialize(analyticsTrackingId)
    ReactGA.set({
      appName: env || 'Production',
      appVersion: version
    })
  }
}

export const triggerAnalyticsEvent = settings => {
  if (analyticsTrackingId && env === 'production') {
    ReactGA.event(settings)
  } else {
    console.debug('Analytics Event:', settings) // eslint-disable-line no-console
  }
}

export const createProjectEvent = ({ firestore, projectId }, pushObject) => {
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

export const setGAUser = auth => {
  if (auth && auth.uid) {
    ReactGA.set({ userId: auth.uid })
  }
}

export const trackRouteUpdate = () => {
  if (analyticsTrackingId) {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
}

export default { initGA, trackRouteUpdate }
