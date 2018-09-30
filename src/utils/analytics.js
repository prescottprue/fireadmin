import { version } from '../../package.json'
import { segmentId, env } from 'config' // eslint-disable-line import/no-unresolved
import { ANALYTICS_EVENT_NAMES } from 'constants'

/**
 * Set User info to analytics context
 * @param {Object} auth - User auth object
 * @param {String} auth.uid - Current user's UID
 */
export function setAnalyticsUser(auth) {
  if (auth && auth.uid && window.analytics) {
    window.analytics.identify(auth.uid, {
      name: auth.displayName,
      email: auth.email,
      avatar: auth.photoURL,
      version
    })
  }
}

/**
 * Initalize Segment Library when in production environment
 */
export function initSegment() {
  // Only initialize if in production and segmentId exists
  if (segmentId && env === 'production') {
  /* eslint-disable */
    !function(){
      var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on"];analytics.factory=function(t){return function(){var e=Array.prototype.slice.call(arguments);e.unshift(t);analytics.push(e);return analytics}};for(var t=0;t<analytics.methods.length;t++){var e=analytics.methods[t];analytics[e]=analytics.factory(e)}analytics.load=function(t,e){var n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src="https://cdn.segment.com/analytics.js/v1/"+t+"/analytics.min.js";var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(n,a);analytics._loadOptions=e};analytics.SNIPPET_VERSION="4.1.0";
      analytics.load(segmentId);
      analytics.page({ version });
    }}();
    /* eslint-enable */
  }
}

/**
 * Trigger analytics event within google analytics through react-ga
 * @param  {Object} eventData - Data associated with the event.
 */
export function triggerAnalyticsEvent(eventNameKey, eventData) {
  const eventName = ANALYTICS_EVENT_NAMES[eventNameKey]
  if (!eventName) {
    /* eslint-disable no-console */
    console.warn(
      `Event name for event key: "${eventNameKey}" not found. Check ANALYTICS_EVENT_NAMES in src/constants.js.`
    )
    /* eslint-enable no-console */
  } else {
    if (segmentId && window.analytics && env === 'production') {
      window.analytics.track(eventName, eventData)
    } else {
      console.debug('Analytics Event:', eventName, eventData) // eslint-disable-line no-console
    }
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

export default { triggerAnalyticsEvent }
