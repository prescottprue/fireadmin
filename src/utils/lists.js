/** Gets list of objects created by the currently logged in User.
 * @param {String|Array} listPath -  The name or path of the list the objects will be grabbed from. `Required`
 * @param {String} Uid - The Uid of the user that created objects. `Required`
 * @return {Promise}
 * @example
 * // Signin User with email and password
 * var uid = 'simplelogin:1' //User id
 * fb.listByUid('messages', uid).then(function(messageList){
 *  logger.log('List of messages by ' + uid + ' : ', messageList)
 * }, function(err){
 *  logger.error('Error getting message list:', err)
 * })
 */
export function listByCurrentUser (listName) {
  if (!listName) {
    return Promise.reject({message: 'Listname required to list objects.'})
  }
  if (!this.isAuthorized) {
    const error = {code: 'INVALID_AUTH', message: 'listByCurrentUser cannot load list without current user'}
    logger.error(error.message)
    return Promise.reject(error)
  }
  return new Promise((resolve, reject) => {
    const authorObjQuery = this.ref.child(listName).orderByChild('author').equalTo(this.auth.uid)
    authorObjQuery.on('value', listSnap => {
      return resolve(listSnap.val())
    }, (err) => {
      return reject(err)
    })
  })
}
