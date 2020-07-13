import { useEffect } from 'react'
import { useAnalytics, useUser } from 'reactfire'
import { useLocation } from 'react-router-dom'
import { setErrorUser } from 'utils/errorHandler'

export default function AnalyticsPageViewLogger() {
  const location = useLocation()
  const analytics = useAnalytics()
  const user = useUser()
  // By passing `user.uid` to the second argument of `useEffect`,
  // we only set user id when it exists
  useEffect(() => {
    if (user?.uid) {
      analytics.setUserId(user.uid)
      setErrorUser(user)
    }
  }, [user?.uid]) // eslint-disable-line react-hooks/exhaustive-deps

  // By passing `location.pathname` to the second argument of `useEffect`,
  // we only log on first render and when the `pathname` changes
  useEffect(() => {
    if (!window.Cypress) {
      // Trigger event in Firebase analytics
      if (process.env.REACT_APP_FB_measurementId) {
        analytics.logEvent('page-view', { path_name: location.pathname })
      }
      // Track event in Segment
      if (process.env.REACT_APP_SEGMENT_ID && window.analytics) {
        window.analytics.track('page-view', { path_name: location.pathname })
      }
    }
  }, [location.pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}
