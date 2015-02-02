# FireAdmin

Library to simplify implementing standard app functionality when using Firebase (User/Presence Management, Object CRUD and Listing).


## Getting Started
1. Include both the Firebase library and  `fireadmin.js` in your `index.html` :

  ```html
  <script src="https://cdn.firebase.com/js/client/2.1.2/firebase.js"></script>
  <script src="http://d1lxebzlcdgkt.cloudfront.net/current/fireadmin.min.js"></script>

  ```

2. Create a new Fireadmin Object:

  ```javascript
  var fa = new Fireadmin("https://<your-app>.firebaseio.com");
  ```

## Documentation
Documentation is automatically generated with JSDoc and is included in this repo under `dist/docs`.

There is also a hosted version available: [Docs Page](https://s3.amazonaws.com/prescottprue/Fireadmin/current/docs/Fireadmin.html)

## Planning
* Role Management
* Admin Parameter
* Implement [Google Closure Library](https://github.com/google/closure-library)
* Unit Tests
* Multi Provider Login

## Contributing

Fork repository and use `index.html` to test.
