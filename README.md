# FireAdmin
[![npm version](https://img.shields.io/npm/v/fireadmin.svg?style=flat-square)](https://www.npmjs.com/package/fireadmin)
[![npm downloads](https://img.shields.io/npm/dm/fireadmin.svg?style=flat-square)](https://www.npmjs.com/package/fireadmin)
[![build status](https://img.shields.io/travis/prescottprue/fireadmin/master.svg?style=flat-square)](https://travis-ci.org/prescottprue/fireadmin)
[![dependencies status](https://img.shields.io/david/prescottprue/fireadmin/master.svg?style=flat-square)](https://david-dm.org/prescottprue/fireadmin)
[![codeclimate](https://img.shields.io/codeclimate/github/prescottprue/fireadmin.svg?style=flat-square)](https://codeclimate.com/github/prescottprue/fireadmin)
[![coverage](https://img.shields.io/codeclimate/coverage/github/prescottprue/fireadmin.svg?style=flat-square)](https://codeclimate.com/github/prescottprue/fireadmin)
[![license](https://img.shields.io/npm/l/fireadmin.svg?style=flat-square)](https://github.com/prescottprue/fireadmin/blob/master/LICENSE)

| Fireadmin organizes and simplifies usage of [Firebase](http://firebase.com)

FireAdmin is a Javascript Library built to simplify implementing standard app functionality when using Firebase (User/Presence Management, Object CRUD/ Listing/Counting).

FireAdmin is especially useful when you are trying to administer a Firebase data set (hence the name). Administration dashboards are a breeze thanks to functions like `getOnlineUserCount()` that provide analytics data in simple and easy to understand calls.

## Features
* Authentication pared to user management
* User Profile created on signup
* Session management
* Descructured Population based on ID
* Role management


## Getting Started

1. Include the Fireadmin bundle in your `index.html` :

  ```html
  <script src="http://cdn.prue.io/fireadmin/0.0.3/fireadmin.min.js"></script>
  <!-- Or the following for the latest version -->
  <!-- <script src="http://cdn.prue.io/fireadmin/latest/fireadmin.min.js"></script> -->

  ```
**or**
Install through package managers:
`npm install fireadmin --save`
`bower install fireadmin --save`

2. Create a new FireAdmin Object:

  ```javascript
var fa = new Fireadmin("https://<your-app>.firebaseio.com");
  ```

3. Start using Fireadmin!
    ```javascript
    //Get count of users
    fa.getUserCount().then(function(count){
        console.log('Your app currently has ' + count + ' users.');
    });
    ```

## [API Documentation](http://cdn.prue.io/fireadmin/latest/docs/class/src/fireadmin.js~Fireadmin.html)
#### [Docs Page](http://cdn.prue.io/fireadmin/latest/docs/index.html)

API Documentation is automatically generated with JSDoc and is included in this repo under `dist/docs` if you would like to view a local version.



## Contributing

1. Fork repository
2. Run `npm install` to install dev dependencies.
3. Run `npm start` to Serve and Open the dev environment.

## Planning
* Role Management
* Automatic Rules Setup
* Admin Parameter
