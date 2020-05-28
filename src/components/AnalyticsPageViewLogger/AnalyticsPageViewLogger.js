import { useEffect } from 'react'
import { useAnalytics, useUser } from 'reactfire'
import { useLocation } from 'react-router-dom'
import * as config from 'config' // eslint-disable-line import/no-unresolved

export default function AnalyticsPageViewLogger() {
  const location = useLocation()
  const analytics = useAnalytics()
  const user = useUser()
  // By passing `user.uid` to the second argument of `useEffect`,
  // we only set user id when it exists
  useEffect(() => {
    if (user?.uid) {
      analytics.setUserId(user.uid)
    }
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // By passing `location.pathname` to the second argument of `useEffect`,
  // we only log on first render and when the `pathname` changes
  useEffect(() => {
    if (!window.Cypress) {
      // Trigger event in Firebase analytics
      if (config.firebase.measurementId) {
        analytics.logEvent('page-view', { path_name: location.pathname })
      }
      // Track event in Segment
      if (config.segmentId && window.analytics) {
        window.analytics.track('page-view', { path_name: location.pathname })
      }
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
