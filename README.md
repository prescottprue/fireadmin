# FireAdmin

[![GitHub version](https://badge.fury.io/gh/prescottprue%2Ffireadmin.svg)](http://badge.fury.io/gh/prescottprue%2Ffireadmin)

FireAdmin is a all Javascript Library built to simplify implementing standard app functionality when using Firebase (User/Presence Management, Object CRUD/ Listing/Counting).

FireAdmin is especially useful when you are trying to administer a Firebase data set (hence the name). Administration dashboards are a breeze thanks to functions like `getOnlineUserCount()` that provide analytics data in simple and easy to understand calls.

### [API Documentation](https://s3.amazonaws.com/prescottprue/Fireadmin/current/docs/Fireadmin.html)

### [Angular Integration](https://github.com/prescottprue/AngularFireadmin)

## Getting Started

1. Include script reference to fireadmin in your `index.html` :

  ```html
  <script src="https://s3.amazonaws.com/prescottprue/fireadmin/current/fireadmin-bundle.js"></script>

  ```


  **or** 

  Include both the Firebase library (`firebase.js`) and Fireadmin (`fireadmin.js` or `fireadmin.min.js` if you prefer the minified version).

  ```html
  <script src="https://cdn.firebase.com/js/client/2.2.2/firebase.js"></script>
  <script src="https://s3.amazonaws.com/prescottprue/fireadmin/current/fireadmin.min.js"></script>

  ```

2. Create a new FireAdmin Object:

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

## Documentation

#### [Docs Page](https://s3.amazonaws.com/prescottprue/Fireadmin/current/docs/Fireadmin.html)

API Documentation is automatically generated with JSDoc and is included in this repo under `dist/docs` if you would like to view a local version.

## Using With Angular
Usage of [AngularJS](http://angularjs.org) with FireAdmin is *strongly suggested* and is included just as easily as including the standard version of FireAdmin :

```html
  <!-- Add AngularJS, Firebase, AngularFire, FireAdmin, and AngularFireAdmin -->
  <script src="https://s3.amazonaws.com/prescottprue/angularfireadmin/current/angularfireadmin-bundle.js"></script>
```

This script tag is the bundle file from the AngularJS integration for FireAdmin which is named [**AngularFireAdmin**](https://github.com/prescottprue/AngularFireAdmin).

## Planning
* Complete Angular Integration
* Role Management
* Automatic Rules Setup
* Admin Parameter
* Unit Tests

## Contributing

1. Fork repository
2. Run `npm install` to install dev dependencies.
3. Run `grunt` to Serve and Open the dev environment.

### Config

`config.json` contains the configuration settings for Grunt. These settings include the name of the development/distribution folders and the Port on which to run the development web server.

### Environment

`env.json` contains environment configuration and is therefore not included in the commit history. **THIS IS TO KEEP YOUR KEYS SAFE!**. S3 keys/bucket, and closure path are included in this file.
