import * as admin from 'firebase-admin'

/**
 * Create a reference to Real Time Database at a provided path. Uses credentials
 * of Cloud Functions.
 * @param  {String} refPath - path for database reference
 * @return {firebase.Database.Reference} Database reference for provided path
 */
export function rtdbRef(refPath) {
  return admin.database().ref(refPath)
}

/**
 * Watch a snapshot location for completed: true. Also handles errors.
 * @param  {Object} snap - Snapshot which to watch for completed flag
 * @return {Promise} Resolves with request snapshot after completed === true
 */
export function waitForValue(ref) {
  return new Promise((resolve, reject) => {
    const EVENT_TYPE = 'value'
    let requestListener
    requestListener = ref.on(
      EVENT_TYPE,
      responseSnap => {
        if (responseSnap.val()) {
          const requestVal = responseSnap.val()
          // reject if watching request errors out
          if (requestVal.status === 'error' || requestVal.error) {
            reject(responseSnap.val().error)
          } else {
            // Unset listener
            ref.off(EVENT_TYPE, requestListener)
            resolve(responseSnap)
          }
        }
      },
      err => {
        console.error(`Error waiting for value at path: ${ref.path}`, err)
        reject(err)
      }
    )
  })
}
