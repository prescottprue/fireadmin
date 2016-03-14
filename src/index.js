import Firebase from 'firebase'
import auth from './utils/auth'
import { nameFromUrl } from './utils/fb'

export default class Fireadmin {
  /** Constructor
   * @param {string} appName Name of application
   */
  constructor (url, opts) {
    if (!url) throw new Error('Firebase url is required to use Fireadmin')
    this.url = url
    this.rootRef = new Firebase(url)
    this.name = nameFromUrl(url)
    if (opts) this.options = opts
    Object.assign(this, auth(this.rootRef))
  }

  get isAuthorized () {
    return this.rootRef.getAuth()
  }

}
