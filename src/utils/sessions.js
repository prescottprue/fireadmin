export default () => {
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
     *  logger.log('There are ' + count + ' messages')
     * })
     */
    sessionsBetween (time1, time2) {
      return new Promise((resolve, reject) => {
        this.ref.child('sessions').orderByChild('ended').startAt(time1).endAt(time2).on('value', (sessionsSnap) => {
          resolve(sessionsSnap.numChildren())
        }, error => {
          console.error({ description: 'Error getting sessions between specified times.', error })
          reject({message: 'Error getting sessions.'})
        })
      })
    }
    /** Get the number of sessions since a specific time
     * @param {String} time - The UTC time to calculate from.
     * @return {Promise}
     * @example
     * var dt = new Date() //Create a new Data object
     * dt.setMonth(dt.getMonth()-1) //Set date back a month
     * var monthAgo = dt.getTime() //Convert to UTC time
     * //Get number of sessions since a month ago
     * fa.sessionsSince(monthAgo).then(function(count){
     *  logger.log('There are ' + count + ' sessions in the past month')
     * })
     */
    sessionsSince (time) {
      return new Promise((resolve, reject) => {
        this.ref.child('sessions').orderByChild('ended').startAt(time).endAt(Date.now()).on('value', (sessionsSnap) => {
          return resolve(sessionsSnap.numChildren())
        }, (err) => {
          logger.error({description: 'Error getting sessions between specified times.', error: err, func: 'sessionsSince', obj: 'Fireadmin'})
          return reject(err)
        })
      })
    }
    /**
     * Calculate average session length
     * @return {Promise}
     * @example
     * //Get the average session length
     * fa.averageSessionLength(function(count){
     *  logger.log('The average session length is ~' + count ' mins')
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
            logger.log('total length is now:', totalLength)
          } else {
            logger.log('removing unfinished session:', sessionSnap.val())
            sessionCount--
            logger.log('session count:', sessionCount)
          }
        })
        logger.log('totalLength:', totalLength)
        var average = Math.floor(totalLength / sessionCount)
        logger.log('average in minutes:', average)
        return resolve(average)
        }, (err) => {
          return reject(err)
        })
      })
    }
    /** Remove a user's sessions from the sessions record
     * @param {String} uid - The UID of the user for which to remove sessions.
     * @return {Promise}
     * @example
     * // Remove all of simplelogin:1's sessions
     * fb.removeUserSessions('simplelogin:1').then(function() {
     *  logger.log('Simplelogin:1 no longer has any sessions')
     * }, function(err){
     *  logger.error('Error removing sessions:', err)
     * })
     */
    removeUserSessions (uid) {
      return new Promise((resolve, reject) => {
        this.ref.child('sessions').orderByChild('user').equalTo(uid).on('value', (sessionsSnap) => {
          var sessionCount = sessionsSnap.numChildren()
          sessionsSnap.forEach((session) => {
            session.ref().remove()
          })
          logger.log(sessionCount + ' Sessions sucessfully removed')
          return resolve()
        }, (err) => {
          return reject(err)
        })
      })
    }
  }
  
}
