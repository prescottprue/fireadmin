import _ from 'lodash'
import Firebase from 'firebase'

export default class Fireadmin {
  /** Constructor
   * @param {string} appName Name of application
   */
  constructor (url, opts) {
    if (!url) {
      throw new Error('Application name is required to use Fireadmin')
    }
    this.ref = new Firebase(url)
    this.fbUrl = url
    this.appName = AppNameFromUrl(url)
    if (opts) {
      this.options = opts
    }
  }

  get auth () {
    return this.ref.getAuth()
  }

  get isAuthorized () {
    return this.auth || null
  }

  /**
   * Modified version of Firebase's authWithPassword that handles presence
   * @param {Object | String} loginData - Login data object or string for 3rd Party Signup (Twitter, Github, Google) `Required`
   * @param {Object} loginData.email - Email of new user (`Required` only for email signup).
   * @return {Promise}
   * @example
   * // Signin User with email and password
   * fb.userSignup({email:test@test.com, password:'testtest'}).then(function(auth){
   *  console.log('Login Successful for user:', auth.uid)
   * }, function(err){
   *  console.error('Error logging in:', err)
   * })
   */
  signup (signupData) {
    const { email, username password } = signupData
    //Email signup
    if (!password && password.length <= 8) {
      return Promise.reject({ message: 'A valid Password is required to signup.' })
    }
    //Create new user in simple login
    return new Promise((resolve, reject) => {
      this.createUser(signupData, (error) => {
        if (error === null) {
          console.log('[emailSignup] User created successfully. Logging in as new user...')
            // Login with new account
            this.emailAuth(signupData, (authData) => {
              //Create new user profile
              createUserProfile(authData, this.ref, (userAccount) => {
                userAccount
              }, (err) => {
                //Error creating profile
                return Promise.reject(err)
              })
            }, (err) => {
              //Error authing with email
              return Promise.reject(err)
            })
        } else {
          //Error creating new User
          console.error('[emailSignup] Error creating user:', error.message)
          return Promise.reject(error)
        }
      })
    })
    }
  }

  /** Modified version of Firebase's authWithPassword that handles presence
   * @param {Object} loginData Login data of new user
   * @return {Promise}
   * @example
   * // Signin User with email and password
   * fb.emailAuth({email:test@test.com, password:'testtest'}, function(auth){
   *  console.log('Login Successful for user:', auth.uid)
   * }, function(err){
   *  console.error('Error logging in:', err)
   * })
   */
  emailAuth(loginData) {
    this.ref.authWithPassword(loginData, (error, authData) => {
      if (error === null) {
        // user authenticated with Firebase
        console.log({description: 'Successfully authed.', authData, userId: authData.uid, provider: authData.provider, func: 'emailAuth', obj: 'Fireadmin'})
        // Manage presence
        this.setupPresence(authData.uid)
        // [TODO] Check for account/Add account if it doesn't already exist
        return resolve(authData)
      } else {
        console.error('Error authenticating user:', error)
        return reject(err)
      }
    })
  }
  /** Modified version of Firebase's authWithOAuthPopup function that handles presence
   * @param {String} provider - Login data of new user. `Required`
   * @example
   * // Signin User with email and password
   * fb.authWithOAuthPopup('google', function(auth){
   *  console.log('Login Successful for user:', auth.uid)
   * }, function(err){
   *  console.error('Error logging in:', err)
   * })
   */
  authWithOAuthPopup(provider) {
    //[TODO] Check enabled login types
    return new Promise((resolve, reject) => {
      this.ref.authWithOAuthPopup(provider).then(authData => {
        // Manage presence
        this.setupPresence(authData.uid)
        // [TODO] Check for account/Add account if it doesn't already exist
        return authData
      }, error => {
        console.error('Error authenticating user:', error)
        return reject(error)
      })
    })
  }
}
