
(function(window, document){
  //Initialize Library
  init();
  /**
   * Creates a Fireadmin object
   * @module Fireadmin
   */
  function Fireadmin(url, optionsObj){
    if(typeof url == "undefined" || typeof url != "string"){
      throw new Error('Url is required to use FireAdmin');
    }
    this = new ExtendedRef(url);
    this.fbUrl = url;
    return this
  }
  Fireadmin.prototype.createObject = function(obj, listName, successCb, errorCb){
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
  *
  */
  /**
  * Success callback for emailAuth function
  * @callback authWithPassword~successCb
  * @param {object} authData Returned authentication data
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
  Firebase.prototype.accountById = function(uid, successCb, errorCb){
    this.child(uid).on('value', function(accountSnap){
      successCb(accountSnap.val());
    }, function(err){
      console.error('Error getting account by id:', err);
      if(errorCb){
        errorCb()
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
  /* Initialization function
 * @
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
