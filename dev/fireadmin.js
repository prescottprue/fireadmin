
(function(window, document){
  //Initialize Library
  init();
  /**
   * Creates a Fireadmin object
   * @module Fireadmin
   */
  function Fireadmin(url, optionsObj) {
    if(typeof url == "undefined" || typeof url != "string"){
      throw new Error('Url is required to use FireAdmin');
    }
    this = new ExtendedRef(url);
    this.fbUrl = url;
    return this
  }
  /**
   * Creates an object provided the name of the list the object will go into and the object itself.
   * The object is created with a createdAt parameter that is a server timestamp from Firebase.
   * If a user is currently signed in, the object will contain the author's `$uid` under the author parameter. This is used for the getListByAuthor function.
   * @function Fireadmin.createObject
   * @param {string} listName - The name of the list the object will be put into.
   * @param {object} object - Object you wish to create
   * @param {Fireadmin~createObjectCb} onComplete - Function that runs when your object has been created successfully
   * @example
   * //creates new message object in message list
   * fa.createObject('messages', {title:Example, content:"Cool Message"}, function(newMsgRef){
   *  console.log('New Message created successfuly');
   * }, function(err){
   *  console.error('Error creating new message:', err);
   * });
   */
  Fireadmin.prototype.createObject = function(listName, obj, successCb, errorCb){
    var auth = this.getAuth();
    if(auth) {
      obj.author = auth.uid;
    }
    obj.createdAt = Date.now();
    var newObjRef = this.child(argListName).push(argObject, function(err){
      if(!err){
        if(successCb){
          successCb(newObjRef);
        }
      } else {
        if(errorCb){
          errorCb(err);
        }
      }
    });
  };
  /** Modified version of Firebase's authWithPassword that handles presense
   * @function Firebase.emailAuth
   * @param {object} loginData Login data of new user
   * @param {emailAuth~successCb} successCb Function that runs when you successfully log in
   * @param {Fireadmin~errorCb} errorCb Function that runs if there is an error
   * @example
   * // Signin User with email and password
   * fb.emailAuth({email:test@test.com, password:'testtest'}, function(auth){
   *  console.log('Login Successful for user:', auth.uid);
   * }, function(err){
   *  console.error('Error logging in:', err);
   * });
   *
   *
   */
  Firebase.prototype.emailAuth = function(loginData, successCb, errorCb){
    var self = this;
    self.authWithPassword(loginData, function(error, authData) {
      if (error === null) {
        // user authenticated with Firebase
        console.log("User ID: " + authData.uid + ", Provider: " + authData.provider);
        // Manage presense
        self.setupPresence(authData.uid);
        // [TODO] Check for account/Add account if it doesn't already exist
        successCb(authData);
      } else {
        console.error("Error authenticating user:", error);
        if(errorCb) {
          errorCb(error);
        }
      }
    });
  };
  /**
   * Success callback for emailAuth function
   * @callback emailAuth~successCb
   * @param {object} authData Returned authentication data
   */
  /** Enable presence management for a specificed user
   * @function Firebase.setupPresence
   * @param {string} uid Unique Id for user that presence is being setup for
   *
   */
  Firebase.prototype.setupPresence = function(uid){
    console.log('setupPresence called for uid:', uid);
    var self = this;
    var amOnline = self.child('.info/connected');
    var onlineRef = self.child('presense').child(uid);
    var sessionsRef = self.child('sessions');
    var userRef = self.child('users').child(uid);
    var userSessionRef = self.child('users').child(uid).child('sessions');
    var pastSessionsRef = userSessionRef.child('past');
    amOnline.on('value', function(snapShot){
      if(snapShot.val()) {
        //user is online
        var onDisconnectRef = self.onDisconnect();
        // add session and set disconnect
        var session = sessionsRef.push({began: Firebase.ServerValue.TIMESTAMP, user:uid});
        var endedRef = session.child('ended');
        endedRef.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);
        //add correct session id to user
        // adding session id to current list under user's session
        var currentSesh = userSessionRef.child('current').push(session.key());
        // Remove session id from users current session folder
        currentSesh.onDisconnect().remove();

        // remove from presense list
        onlineRef.set(true);
        onlineRef.onDisconnect().remove();
        // Add session id to past sessions on disconnect
        // pastSessionsRef.onDisconnect().push(session.key());
        // Do same on unAuth
        self.onUnAuth(function(){
          endedRef.set(Firebase.ServerValue.TIMESTAMP);
          currentSesh.remove();
          onlineRef.remove();
        });
      }
    });
  };
  /** Get account information for a user given their uid
   * @function Firebase.accountById
   * @param {string} uid Unique Id for account
   *
   */
  Firebase.prototype.accountById = function(uid, successCb, errorCb){
    this.child(uid).on('value', function(accountSnap){
      successCb(accountSnap.val());
    }, function(err){
      console.error('Error getting account by id:', err);
      if(errorCb){
        errorCb(err);
      }
    });
  };
  /** Modified version of Firebase's authWithPassword that handles presense
   * @function Firebase.emailAuth
   * @param {object} email Email of account to retreive
   * @param {accountByEmail~successCb} successCb Function that returns account info once it is loaded
   * @param {Fireadmin~errorCb} errorCb Function that runs if there is an error
   *
   */
  Firebase.prototype.accountByEmail = function(email, successCb, errorCb){
    this.child('users').orderByChild('email').equalTo(userEmail).on("value", function(querySnapshot) {
      console.log('accountByEmail returned:', querySnapshot.val());
      successCb(querySnapshot.val());
    }, function(err){
      console.error('Error getting account by email:', err);
      if(errorCb){
        errorCb(err);
      }
    });
  };
  ExtendedRef.prototype.onUnAuth = function(cb){
    this.onAuth(function(authData){
      if(!authData){
        cb();
      }
    });
  };
  // function User(authData){
  //   this.auth = authData;
  //   return this;
  // }
  /** Initialization function
   * @function init
   */
  function init() {
    var requiredVersion = "2.1.2"; // Minimum Firebase Library version
    var fbVersionInt = stringifyVersion(window.Firebase.SDK_VERSION); // Firebase Version with . removed
    var requiredVersionInt = stringifyVersion(requiredVersion); //Required version with . removed
    if(typeof window.Firebase == 'undefined'){ //Check for Firebase library
      throw new Error('Firebase is required to use FireAdmin');
    } else if (fbVersionInt < requiredVersionInt){ //Check Firebase library version
      console.warn('Unsupported Firebase version: ' + window.Firebase.SDK_VERSION +'. Please upgrade to 2.1.2 or newer.');
    }
  };
  //Remove periods from version number
  function stringifyVersion(version){
    return version.replace(".", "").replace(".", "");
  }
})(window, document);
