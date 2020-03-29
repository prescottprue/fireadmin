import {
  NOTIFICATION_SHOW,
  NOTIFICATION_DISMISS,
  NOTIFICATION_CLEAR
} from './actionTypes'

const defaultDismissTime = 5000 // 5 seconds

/**
 * Publish a notification. if `dismissAfter` is set,
 * the notification will be auto dismissed after the given period.
 * @param {Object} notif - Object containing
 * @param {Object} notif.kind - Kinda of notification (success, warning, failure)
 * @param {Object} notif.message - Notification message
 * @param {Object} notif.dismissAfter - Time after which to dismiss
 * notification (default time set in constants)
 */
export function showNotification(notif) {
  const payload = Object.assign({}, notif)
  // Set default id to now if none provided
  if (!payload.id) {
    payload.id = Date.now()
  }
  return (dispatch) => {
    dispatch({ type: NOTIFICATION_SHOW, payload })

    setTimeout(() => {
      dispatch({
        type: NOTIFICATION_DISMISS,
        payload: payload.id
      })
    }, payload.dismissAfter || defaultDismissTime)
  }
}

/**
 * Show a success notification that hides itself
 * after 5 seconds.
 * @param {Object} message - Message to display in Snackbar
 * @returns {Function}
 */
export function showSuccess(message) {
  return showNotification({ type: 'success', message })
}

/**
 * Show a success notification that hides itself
 * after 5 seconds.
 * @param {Object} message - Message to display in Snackbar
 * @returns {Function}
 */
export function showMessage(message) {
  return showNotification({ type: 'info', message })
}

/**
 * Show an error notification that hides itself
 * after 5 seconds.
 * @param {Object} message - Message to display in Snackbar
 * @returns {Function}
 */
export function showError(message) {
  return showNotification({ type: 'error', message: `Error: ${message || ''}` })
}

/**
 * Dismiss a notification by the given id.
 * @param {Number} id - notification id
 * @returns {Object}
 */
export function dismissNotification(payload) {
  return {
    type: NOTIFICATION_DISMISS,
    payload
  }
}

/**
 * Clear all notifications
 * @returns {Object}
 */
export function clearNotifications() {
  return { type: NOTIFICATION_CLEAR }
}
