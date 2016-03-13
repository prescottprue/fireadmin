/**
  * Extracts an app name out of a Firebase url
  * @function AppNameFromUrl
  * @param {String} authData Login data of new user
  * @returns {String} appName App name extracted from url
  */
export function nameFromUrl (url) {
  // remove https:// from beginging and .firebaseio.com from the end
  return url.match(/^(?:https?|ftp)?:\/\/([A-Za-z0-9\-]{0,61}[A-Za-z0-9])?/)[1]
}

export default (ref) => {
  const methods = {
    /** Get a firebase reference for a path in array | string form
     * @param {String|Array} path relative path to the root folder in Firebase instance
     * @returns {Firebase Reference}
     * @example
     * //Array as path
     * var userRef = fa.fbRef(['users', uid])
     */
    fbRef (path) {
      const args = Array.prototype.slice.call(arguments)
      if (args.length) {
        // [TODO] Have this return a Fireadmin object
        ref = ref.child(pathRef(args))
      }
      return ref
    }
  }
  return Object.assign(
    {},
    methods
  )
}

function pathRef (args) {
  for (var i = 0; i < args.length; i++) {
    if (typeof (args[i]) === 'object') {
      args[i] = pathRef(args[i])
    }
  }
  return args.join('/')
}
