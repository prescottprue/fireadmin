//Self Executing Anonymous Function
(function(window, document){
  //Initialize Library
  init();
  // Fireadmin Constructor
  function Fireadmin(url, optionsObj){
    if(typeof url == "undefined" || typeof url != "string"){
      throw new Error('Url is required to use FireAdmin');
    }
    this.fbUrl = url;
    this.appRef = new Firebase(url);
    return this
  }
  Fireadmin.prototype.emailLogin = function(loginData, successCb, errorCb){
  };
  // Initialization function
  function init() {
    var requiredVersion = "2.1.2";
    var fbVersionInt = stringifyVersion(window.Firebase.SDK_VERSION);
    var requiredVersionInt = stringifyVersion(requiredVersion);
    if(typeof window.Firebase == 'undefined'){
      throw new Error('Firebase is required to use FireAdmin');
    } else if (fbVersionInt < requiredVersionInt){
      console.warn('Unsupported Firebase version: ' + window.Firebase.SDK_VERSION +'. Please upgrade to 2.1.2 or newer.');
    }
  };
  //Remove periods from version number
  function stringifyVersion(version){
    return version.replace(".", "").replace(".", "");
  }
})(window, document);
