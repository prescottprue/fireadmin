import { extend } from 'lodash'
import Firebase from 'firebase'

export default (ref) => {
  let methods = {

    logout: function () {
      return ref.unauth()
    },
    /** Modified version of Firebase's authWithPassword that handles presence
     * @param {Object} loginData Login data of new user
     * @return {Promise}
     */
    emailAuth: function (loginData) {
      const { username, name, email } = loginData
      return ref.authWithPassword(loginData).then(authData => {
        // user authenticated with Firebase
        console.log({ description: 'Successfully authed.', authData })
        // Manage presence
        this.setupPresence(authData.uid)
        // [TODO] Check for account/Add account if it doesn't already exist
        let profileData = { email }
        if (username) profileData.username = username
        if (name) profileData.name = name
        console.log('email auth returning:', Object.assign({}, profileData, authData))
        return Object.assign({}, profileData, authData)
      }, error => {
        console.error('Error authenticating user:', error)
        return Promise.reject(error)
      })
    },

    /** Modified version of Firebase's authWithOAuthPopup function that handles presence
     * @param {String} provider - Login data of new user. `Required`
     */
    authWithOAuthPopup: function (provider) {
      if (!provider) return Promise.reject({ message: 'Provider required to auth.', status: 'NULL_PROIVDER' })
      // [TODO] Check enabled login types
      return ref.authWithOAuthPopup(provider).then(authData => {
        // Manage presence
        this.setupPresence(authData.uid)
        // [TODO] Check for account/Add account if it doesn't already exist
        return authData
      }, error => {
        if (error.toString().indexOf('Error: There are no login transports') !== -1) return Promise.reject({ message: `${provider} is not enabled.`, status: 'PROVIDER_NOT_ENABLED' })
        return Promise.reject(error)
      })
    },

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
    signup: function (signupData) {
      const { email, password, provider } = signupData
      // Handle 3rd party provider signups
      if (provider) return this.authWithOAuthPopup(provider)
      if (!email) return Promise.reject({ message: 'A valid email is required to signup.', status: 'INVALID_EMAIL' })
      // Validate password
      if (!password || password.length <= 8) return Promise.reject({ message: 'A password of at least 8 characters is required to signup.', status: 'INVALID_PASSWORD' })
      return this.createUser(signupData).then(() => this.emailAuth(signupData).then(authData => this.createProfile(authData)))
    },

    providerSignup: function (provider) {
      // 3rd Party Signup
      // Auth using 3rd party OAuth
      // Create new profile with user data
      return this.authWithOAuthPopup(provider).then(authData => {
        console.log('newProfile:', authData)
        return this.createProfile(authData)
      })
    },

    createUser: function (userData) {
      return ref.createUser(userData)
    },

    createProfile: function (authData) {
      console.log('create profile called', authData)
      const { uid, provider, email, username, name } = authData
      const usersRef = ref.child('users')
      const userRef = usersRef.child(uid)
      let userObj = { role: 10, provider, email, username, name }
      console.log('userObj:', userObj)
      // Check if account with given email already exists
      return usersRef.orderByChild('email').equalTo(email).once('value').then(userQuery => {
        // if (userQuery.val()) return Promise.reject({ message: 'This email has already been used to create an account', status: 'EXISTS' })
        // Account with given email does not already exist
        return userRef.once('value').then(userSnap => {
          if (userSnap.val() || userSnap.hasChild('sessions')) {
            console.error('User account already exists.')
            return Promise.reject(userSnap.val())
          }
          userObj.createdAt = Firebase.ServerValue.TIMESTAMP
          // [TODO] Add check for email before using it as priority
          return userRef.setWithPriority(userObj, email).then(_ => userObj)
        })
      })
    },

    /** Start presence management for a specificed user uid. This function is used within Fireadmin login functions.
     * @param {String} uid Unique Id for user that for which presence is being setup.
     *
     */
    setupPresence: function (uid) {
      console.log('setupPresence', uid)
      let amOnline = ref.child('.info/connected')
      let onlineRef = ref.child('presence').child(uid)
      let sessionsRef = ref.child('sessions')
      let userSessionRef = ref.child('users').child(uid).child('sessions')
      // let pastSessionsRef = userSessionRef.child('past')
      return amOnline.on('value', snapShot => {
        if (!snapShot.val()) return
        // user is online
        let onDisconnectRef = ref.onDisconnect()
        // add session and set disconnect
        let session = sessionsRef.push({ began: Firebase.ServerValue.TIMESTAMP, user: uid })
        session.setPriority(uid)
        let endedRef = session.child('ended')
        endedRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP)
        // add correct session id to user
        // remove from presence list
        onlineRef.set(true)
        onlineRef.onDisconnect().remove()
        // Add session id to past sessions on disconnect
        // pastSessionsRef.onDisconnect().push(session.key())
        // Do same on unAuth
        ref.onAuth(authData => {
          if (!authData) {
            endedRef.set(Firebase.ServerValue.TIMESTAMP)
            onlineRef.remove()
          }
        })
      })
    }
    // usernameSignup: signupData => {
    //   // [TODO] User signup with with custom auth token with username as uid
    //   // Username signup
    //   // request a signup with username as uid
    //   return apiRequest('signup', signupData, (res) => {
    //     return ref.authWithCustomToken(res.token).then(authData => {
    //       return this.createProfile(authData, this.ref, (userAccount) => {
    //         return userAccount
    //       }, error => {
    //         //Error creating profile
    //         return Promise.reject(error)
    //       })
    //     })
    //   }, error => {
    //     return Promise.reject(error)
    //   })
    // },
  }

  return Object.assign(
    {},
    methods
  )
}
