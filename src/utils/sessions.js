export default (ref) => {
  const methods = {
    /** Get the number of sessions between two times
     * @param {Number} startTime - The time at which to start the between period (in UTC ms).
     * @param {Number} endTime - The time at which to start the between period (in UTC ms).
     * @return {Promise}
     * @example
     * //Ten days ago
     * var tenDaysAgo = new Date()
     * d.setDate(d.getDate() - 10)
     * fa.sessionsBetween(Date.now()).then(function(count){
     *  console.log('There are ' + count + ' messages')
     * })
     */
    sessionsBetween (time1, time2) {
      return ref.child('sessions').orderByChild('ended').startAt(time1).endAt(time2).on('value').then(sessionsSnap => {
        return sessionsSnap.numChildren()
      }, error => {
        console.error({ description: 'Error getting sessions between specified times.', error })
        return Promise.reject({ message: 'Error getting sessions.' })
      })
    },

    /** Get the number of sessions since a specific time
     * @param {String} time - The UTC time to calculate from.
     * @return {Promise}
     * @example
     * var dt = new Date() //Create a new Data object
     * dt.setMonth(dt.getMonth()-1) //Set date back a month
     * var monthAgo = dt.getTime() //Convert to UTC time
     * //Get number of sessions since a month ago
     * fa.sessionsSince(monthAgo).then(function(count){
     *  console.log('There are ' + count + ' sessions in the past month')
     * })
     */
    sessionsSince (time) {
      return ref.child('sessions').orderByChild('ended').startAt(time).endAt(Date.now()).on('value').then(sessionsSnap => {
        return sessionsSnap.numChildren()
      }, error => {
        console.error({ description: 'Error getting sessions between specified times.', error })
        return Promise.reject(error)
      })
    },

    /**
     * Calculate average session length
     * @return {Promise}
     * @example
     * //Get the average session length
     * fa.averageSessionLength(function(count){
     *  console.log('The average session length is ~' + count ' mins')
     * })
     */
    averageSessionLength () {
      return new Promise((resolve, reject) => {
        this.ref.child('sessions').on('value', (sessionsSnap) => {
          var totalLength = null
            var sessionCount = sessionsSnap.numChildren()
            sessionsSnap.forEach((sessionSnap) => {
            var session = sessionSnap.val()
            if (session.hasOwnProperty('ended') && session.hasOwnProperty('began')) {
              //Gather length of session
            // Convert difference in ms to minutes
            var conversion = (session.ended - session.began) / (1000 * 60)
            totalLength = totalLength + conversion
            console.log('total length is now:', totalLength)
          } else {
            console.log('removing unfinished session:', sessionSnap.val())
            sessionCount--
            console.log('session count:', sessionCount)
          }
        })
        console.log('totalLength:', totalLength)
        var average = Math.floor(totalLength / sessionCount)
        console.log('average in minutes:', average)
        return resolve(average)
        }, (err) => {
          return reject(err)
        })
      })
    },
    /** Remove a user's sessions from the sessions record
     * @param {String} uid - The UID of the user for which to remove sessions.
     * @return {Promise}
     * @example
     * // Remove all of simplelogin:1's sessions
     * fb.removeUserSessions('simplelogin:1').then(function() {
     *  console.log('Simplelogin:1 no longer has any sessions')
     * }, function(err){
     *  console.error('Error removing sessions:', err)
     * })
     */
    removeUserSessions (uid) {
      return new Promise((resolve, reject) => {
        this.ref.child('sessions').orderByChild('user').equalTo(uid).on('value', (sessionsSnap) => {
          var sessionCount = sessionsSnap.numChildren()
          sessionsSnap.forEach((session) => {
            session.ref().remove()
          })
          console.log(sessionCount + ' Sessions sucessfully removed')
          return resolve()
        }, (err) => {
          return reject(err)
        })
      })
    }
  }
  return Object.assign(
    {},
    methods
  )
}
