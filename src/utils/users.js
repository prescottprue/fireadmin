/** Get account for a user given their uid.
 * @param {String} uid Unique Id for account.
 * @example
 * // Get account for uid: simplelogin:1
 * fa.accountByUid('simplelogin:1', function(account){
 *   console.log('Account for user with uid: ' + uid + ' is : ', account)
 * }, function(err){
 *    console.error('Error getting account for ' + uid + ' : ', err)
 * })
 *
 */


export default (ref) => {
  const methods = {
    accountByUid (uid) {
      return ref.child(uid).on('value').then(accountSnap => {
        return accountSnap.val()
      }, error => {
        console.error({ description: 'Error getting account by UID.', uid, error })
        return Promise.reject(error)
      })
    },

    /** Get user account that is associated to a given email.
     * @param {String} email - Email of account to retreive.
     * @example
     * fa.accountByEmail('test@test.com', function(account){
     *   console.log('Account loaded:' + account)
     * }, function(err){
     *  console.error('Error getting account by email:', err)
     * })
     *
     */
    accountByEmail (email) {
      if (!email) {
        return Promise.reject({message: 'Email is required to get account.'})
      }
      return ref.child('users').orderByChild('email').equalTo(email).on('value').then(querySnapshot => {
        console.log('accountByEmail returned:', querySnapshot.val())
        return Promise.resolve(querySnapshot.val())
      }, error => {
        console.error('Error getting account by email:', error)
        return Promise.reject(error)
      })
    },

    /** Gets list of objects created by the currently logged in User.
     * @param {String | Array} listPath -  The name or path of the list the objects will be grabbed from. `Required`
     * @param {String} Uid - The Uid of the user that created objects. `Required`
     * @return {Promise}
     * @example
     * // Signin User with email and password
     * var uid = 'simplelogin:1'
     * fb.listByUid('messages', uid).then(function(messageList){
     *  console.log('List of messages by ' + uid + ' : ', messageList)
     * }, function(err){
     *  console.error('Error getting message list:', err)
     * })
     */

    objectsListByUid (listPath, uid) {
      ref(listPath).orderByChild('author').equalTo(uid).on('value').then(listSnap => {
        return listSnap.val()
      }, err => {
        return Promise.reject(err)
      })
    },

    /** Get total user count
     * @return {Promise}
     * @example
     * fa.getUserCount('users').then(function(count){
     *  console.log('There are is a total of ' + count + ' users.')
     * })
     */
    count () {
      return ref.child('users').on('value').then(usersListSnap => {
        return usersListSnap.numChildren()
      }, error => {
        console.error({ description: 'Error getting user count.' })
        return Promise.reject(error)
      })
    },

    /** Get the number of users that are currently online.
     * @return {Promise}
     * @example
     * users.onlineCount().then(function(count){
     *   console.log('There are ' + count + ' users currently online.')
     * })
     */
    onlineCount () {
      return ref.child('presence').once('value').then(onlineUserSnap => {
        console.log('There are currently' + onlineUserSnap.numChildren() + ' users online.')
        return onlineUserSnap.numChildren()
      }, error => {
        console.error('Error getting count of online users: ', error)
        return Promise.reject(error)
      })
    }
  }
  return Object.assign(
    {},
    methods
  )
}
