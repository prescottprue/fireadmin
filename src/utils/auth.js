import { extend } from 'lodash'
import Firebase from 'firebase'

export default (ref) => {

  let methods = {

      get auth () {
        return ref.getAuth()
      },

      get isAuthorized () {
        return this.auth || null
      },

      /** Modified version of Firebase's authWithPassword that handles presence
       * @param {Object} loginData Login data of new user
       * @return {Promise}
       */
      emailAuth: loginData => {
        return ref.authWithPassword(loginData).then(authData => {
          // user authenticated with Firebase
          console.log({ description: 'Successfully authed.', authData })
          // Manage presence
          this.setupPresence(authData.uid)
          // [TODO] Check for account/Add account if it doesn't already exist
          return authData
        }, error => {
          console.error('Error authenticating user:', error)
          return Promise.reject(error)
        })
      },

      /** Modified version of Firebase's authWithOAuthPopup function that handles presence
       * @param {String} provider - Login data of new user. `Required`
       */
      authWithOAuthPopup: provider => {
        // [TODO] Check enabled login types
        return ref.authWithOAuthPopup(provider).then(authData => {
          // Manage presence
          this.setupPresence(authData.uid)
          // [TODO] Check for account/Add account if it doesn't already exist
          return authData
        }, error => {
          console.error('Error authenticating user:', error)
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
    signup: signupData => {
      const { email, username, password } = signupData
      //Email signup
      if (!password && password.length <= 8) {
        return Promise.reject({ message: 'A valid Password is required to signup.' })
      }
      //Create new user in simple login
      return this.createProfile(signupData).then(() => {
        console.log('User created successfully. Logging in as new user...')
        // Login with new account
        return this.emailAuth(signupData, authData => {
          //Create new user profile
          return createUserProfile(authData, this.ref, userAccount => {
            userAccount
          }, err => {
            //Error creating profile
            return Promise.reject(err)
          })
        }, err => {
          //Error authing with email
          return Promise.reject(err)
        })
      }, error => {
        //Error creating new User
        console.error('[emailSignup] Error creating user:', error)
        return Promise.reject(error)
      })
    },

    providerSignup: provider => {
      //3rd Party Signup
      // Auth using 3rd party OAuth
      return this.authWithOAuthPopup(provider).then(authData => {
        //Create new profile with user data
        return createUserProfile(authData, ref, (userAccount) => {
          return userAccount
        }, error => {
          //Error creating profile
          return Promise.reject(error)
        })
      }, error => {
        return Promise.reject(err)
      })
    },

    usernameSignup: signupData => {
      // [TODO] User signup with with custom auth token with username as uid
      // Username signup
      // request a signup with username as uid
      return apiRequest('signup', signupData, (res) => {
        return ref.authWithCustomToken(res.token).then(authData => {
          return this.createProfile(authData, this.ref, (userAccount) => {
            return userAccount
          }, error => {
            //Error creating profile
            return Promise.reject(error)
          })
        })
      }, error => {
        return Promise.reject(error)
      })
    },

    createProfile: authData => {
      const { uid, provider } = authData
      const usersRef = ref.child('users')
      const userRef = usersRef.child(uid)
      let userObj = { role: 10, provider }
      if (provider === 'password') {
        userObj.email = authData.password.email
      } else {
        console.log('create 3rd party linked profile:', authData)
        extend(userObj, authData)
      }
      //Check if account with given email already exists
      return usersRef.orderByChild('email').equalTo(userObj.email).on('value').then(userQuery => {
        if (userQuery.val()) {
          // console.warn('Account already exists)
          return Promise.reject({ message: 'This email has already been used to create an account', status: 'EXISTS' })
        }
        // Account with given email does not already exist
        return userRef.once('value').then(userSnap => {
          if (userSnap.val() || userSnap.hasChild('sessions')) {
            console.error('User account already exists', userSnap.val())
            return Promise.reject(userSnap.val())
          }
          userObj.createdAt = Firebase.ServerValue.TIMESTAMP
          // [TODO] Add check for email before using it as priority
          return userRef.setWithPriority(userObj, userObj.email).then(userSnap => {
            console.log('New user account created:', userSnap.val())
            return userSnap.val()
          }, error => {
            return Promise.reject({message: 'Error creating user profile'})
          })
        })
      }, error => {
        //Error querying for account with email
        return Promise.reject(error)
      })
    },

    /** Start presence management for a specificed user uid. This function is used within Fireadmin login functions.
     * @param {String} uid Unique Id for user that for which presence is being setup.
     * @example
     * fa.setupPresence('simplelogin:1')
     *
     */
    setupPresence: uid => {
      const amOnline = ref.child('.info/connected')
      const onlineRef = ref.child('presence').child(uid)
      const sessionsRef = ref.child('sessions')
      const userRef = ref.child('users').child(uid)
      const userSessionRef = ref.child('users').child(uid).child('sessions')
      // const pastSessionsRef = userSessionRef.child('past')
      return amOnline.on('value').then(snapShot => {
        if (!snapShot.val()) {
          return
        }
        // user is online
        const onDisconnectRef = this.ref.onDisconnect()
        // add session and set disconnect
        const session = sessionsRef.push({ began: Firebase.ServerValue.TIMESTAMP, user: uid })
        const endedRef = session.child('ended')
        endedRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP)
        // add correct session id to user
        // adding session id to current list under user's session
        const currentSesh = userSessionRef.child('current').push(session.key())
        // Remove session id from users current session folder
        currentSesh.onDisconnect().remove()
        // remove from presence list
        onlineRef.set(true)
        onlineRef.onDisconnect().remove()
        // Add session id to past sessions on disconnect
        // pastSessionsRef.onDisconnect().push(session.key())
        // Do same on unAuth
        this.onAuth(authData => {
          if (!authData) {
            endedRef.set(Firebase.ServerValue.TIMESTAMP)
            currentSesh.remove()
            onlineRef.remove()
          }
        })
      })
    }
  }

  return Object.assign(
    {},
    methods
  )

}
