# FireAdmin

Library to simplify implementing standard app functionality when using Firebase (User/Presence Management, Object CRUD and Listing)

## Getting Started
1. Include both the Firebase library and  `fireadmin.js` in your `index.html` :

  ```html
  <script src="https://cdn.firebase.com/js/client/2.1.2/firebase.js"></script>
  <script src="fireadmin.js"></script>

  ```

2. Create a new Fireadmin Object:

  ```javascript
  var fa = new Fireadmin("https://<your-app>.firebaseio.com");
  ```

## Planning

* Unit Tests
* Multi Provider Login

## Contributing

Fork repository and use `index.html` to test.
