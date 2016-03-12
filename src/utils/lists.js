/** Gets list of objects created by the currently logged in User.
 * @param {String|Array} listPath -  The name or path of the list the objects will be grabbed from. `Required`
 * @param {String} Uid - The Uid of the user that created objects. `Required`
 * @return {Promise}
 */
export function listByCurrentUser (listName) {
  if (!listName) {
    return Promise.reject({message: 'Listname required to list objects.'})
  }
  if (!this.isAuthorized) {
    const error = { code: 'INVALID_AUTH', message: 'listByCurrentUser cannot load list without current user' }
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
