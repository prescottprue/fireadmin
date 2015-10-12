# FireAdmin
<p align="center">
  <!-- Npm Version -->
  <a href="https://npmjs.org/package/fireadmin">
    <img src="https://img.shields.io/npm/v/fireadmin.svg" alt="npm version">
  </a>
  <!-- Build Status -->
  <a href="https://travis-ci.org/prescottprue/fireadmin">
    <img src="http://img.shields.io/travis/prescottprue/fireadmin.svg" alt="build status">
  </a>
  <!-- Dependency Status -->
  <a href="https://david-dm.org/prescottprue/fireadmin">
    <img src="https://david-dm.org/prescottprue/fireadmin.svg" alt="dependency status">
  </a>
  <!-- Codeclimate -->
  <a href="https://codeclimate.com/github/prescottprue/fireadmin">
    <img src="https://codeclimate.com/github/prescottprue/fireadmin/badges/gpa.svg" alt="codeclimate">
  </a>
  <!-- Coverage -->
  <a href="https://codeclimate.com/github/prescottprue/fireadmin">
    <img src="https://codeclimate.com/github/prescottprue/fireadmin/badges/coverage.svg" alt="coverage">
  </a>
  <!-- License -->
  <a href="https://github.com/KyperTech/FireAdmin/blob/master/LICENSE.md">
    <img src="https://img.shields.io/npm/l/fireadmin.svg" alt="license">
  </a>
</p>

| Fireadmin organizes and simplifies usage of [Firebase](http://firebase.com)

FireAdmin is a Javascript Library built to simplify implementing standard app functionality when using Firebase (User/Presence Management, Object CRUD/ Listing/Counting).

FireAdmin is especially useful when you are trying to administer a Firebase data set (hence the name). Administration dashboards are a breeze thanks to functions like `getOnlineUserCount()` that provide analytics data in simple and easy to understand calls.

[AngularJS](http://angularjs.org) factories are built in to make building even easier.

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

## Planning
* Role Management
* Automatic Rules Setup
* Admin Parameter

## Contributing

1. Fork repository
2. Run `npm install` to install dev dependencies.
3. Run `gulp` to Serve and Open the dev environment.

### Config

`config.json` contains the configuration settings for Grunt. These settings include the name of the development/distribution folders and the Port on which to run the development web server.

### Environment

You must have the correct Environment variables set to upload to CDN.

Required Variables:
* `AWS_ACCESS_KEY_ID`
* `AWS_SECRET_ACCESS_KEY`
