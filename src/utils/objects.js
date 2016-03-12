import
export default () => {
  const methods = {
    /** Creates an object provided the name of the list the object will go into and the object it this.
     * @description The object is created with a createdAt parameter that is a server timestamp from Firebase. If a user is currently signed in, the object will contain the author's `$uid` under the author parameter.
     * @param {String} listName - The name of the list the object will be put into. `Required`
     * @param {Object} objectData - Data you wish to be contained within new object. `Required`
     * @return {Promise}
     * @example
     * //creates new message object in message list
     * fa.createObject('messages', {title:'Example', content:'Cool Message'}).then(function(newMsg){
     *  console.log('New Message created successfuly:', newMsg)
     * }, function(err){
     *  console.error('Error creating new message:', err)
     * })
     */
    createObject (listName, obj) {
      var auth = this.ref.getAuth()
      if (auth) {
        obj.author = auth.uid
      }
      obj.createdAt = Date.now()
      return new Promise((resolve, reject) => {
        this.ref.child(listName).push(obj, err => {
          if (err) {
            return reject(err)
          }
          resolve(obj)
        })
      })
    }
    /** Gets list of objects created by the currently logged in User.
     * @param {String|Array} listPath -  The name or path of the list the objects will be grabbed from. `Required`
     * @param {String} Uid - The Uid of the user that created objects. `Required`
     * @return {Promise}
     * @example
     * // Signin User with email and password
     * var uid = 'simplelogin:1' //User id
     * fb.listByUid('messages', uid).then(function(messageList){
     *  console.log('List of messages by ' + uid + ' : ', messageList)
     * }, function(err){
     *  console.error('Error getting message list:', err)
     * })
     */
    listByCurrentUser: listName => {
      if (!listName) {
        return Promise.reject({message: 'Listname required to list objects.'})
      }
      if (!this.isAuthorized) {
        const error = {code: 'INVALID_AUTH', message: 'listByCurrentUser cannot load list without current user'}
        console.error(error.message)
        return Promise.reject(error)
      }
      const authorObjQuery = this.ref.child(listName).orderByChild('author').equalTo(this.auth.uid)
      return authorObjQuery.on('value').then(listSnap => {
        return listSnap.val()
      }, error => {
        return Promise.reject(error)
      })
    }
  }

  return Object.assign(
    {},
    methods
  )
}
