# FireAdmin

FireAdmin is a all Javascript Library built to simplify implementing standard app functionality when using Firebase (User/Presence Management, Object CRUD/ Listing/Counting).

FireAdmin is especially useful when you are trying to administer a Firebase data set (hence the name). Administration dashboards are a breeze thanks to functions like `getOnlineUserCount()` that provide analytics data in simple and easy to understand calls.

## Getting Started
1. Include both the Firebase library and  `fireadmin.js` in your `index.html` :

  ```html
  <script src="https://cdn.firebase.com/js/client/2.1.2/firebase.js"></script>
  <script src="https://s3.amazonaws.com/prescottprue/Fireadmin/current/fireadmin.min.js"></script>

  ```

2. Create a new Fireadmin Object:

  ```javascript
var fa = new Fireadmin("https://<your-app>.firebaseio.com");
  ```

3. Start using Fireadmin!

    ```javascript
    //Get count of users
    fa.getUserCount(function(count){
        console.log('Your app currently has ' + count + ' users.');
    });
    ```

## Example Controllers

```
.controller('AccountCtrl', ['$scope','sessionService', function($scope, sessionService){
  console.log('AccountCtrl');
  sessionService.getCurrentUser().then(function(account){
    console.log('Account retreived:', account);
    $scope.account = account;
  });
  $scope.updateAccount = function() {
    //[TODO] Handle update of account
  };
}])
.controller('LoginCtrl', ['$scope','sessionService', function($scope, sessionService){
  console.log('AccountCtrl');

  $scope.loginData = {};
  $scope.emailLogin = function(){
    sessionService.emailLogin($scope.loginData).then(function(){

    });
  }
}])
.controller('SignupCtrl', ['$scope','$state','sessionService', function($scope, $state, sessionService){
  console.log('SignupCtrl');

  $scope.signupData = {};
  $scope.err = null;
  $scope.signup = function(){
    sessionService.signup($scope.signupData).then(function(account){
       $state.go('home');
    }, function(err){
      $scope.err = err;
    });
  }
}])
```


## [API Documentation](https://s3.amazonaws.com/prescottprue/Fireadmin/current/docs/Fireadmin.html)
#### [Docs Page](https://s3.amazonaws.com/prescottprue/Fireadmin/current/docs/Fireadmin.html)

API Documentation is automatically generated with JSDoc and is included in this repo under `dist/docs` if you would like to view a local version.

## Planning

* Role Management
* Automatic Rules Setup
* Admin Parameter
* Angular Integration
* Seperate Structure with [Google Closure Library](https://github.com/google/closure-library)
* Unit Tests

## Contributing

1. Fork repository
2. Run `npm install` to install dev dependencies.
3. Run `grunt` to Serve and Open the dev environment.

### Config

`config.json` contains the configuration settings for Grunt. These settings include the name of the development/distribution folders and the Port on which to run the development web server.
