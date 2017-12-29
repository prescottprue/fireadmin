import ReactGA from 'react-ga'
import { version } from '../../package.json'
import { analyticsTrackingId, env } from 'config' // eslint-disable-line import/no-unresolved

// Initialize Google Analytics
export const initGA = () => {
  if (analyticsTrackingId && env === 'prod') {
    ReactGA.initialize(analyticsTrackingId)
    ReactGA.set({
      appName: env || 'Production',
      appVersion: version
    })
  }
}

export const trackEvent = settings => {
  if (analyticsTrackingId) {
    ReactGA.event(settings)
  } else {
    console.debug('Analytics event:', settings) // eslint-disable-line no-console
  }
}

export const setGAUser = auth => {
  if (auth && auth.uid) {
    ReactGA.set({
      userId: auth.uid
    })
  }
}

export const trackRouteUpdate = () => {
  if (analyticsTrackingId) {
    ReactGA.set({ page: window.location.pathname })
    ReactGA.pageview(window.location.pathname)
  }
}

export default { initGA, trackRouteUpdate }
