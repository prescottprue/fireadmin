# fireadmin

<!-- [![NPM version][npm-image]][npm-url] -->
[![Build Status][travis-image]][travis-url]
<!-- [![Dependency Status][daviddm-image]][daviddm-url] -->
<!-- [![Code Coverage][coverage-image]][coverage-url] -->
<!-- [![Code Climate][climate-image]][climate-url] -->
[![License][license-image]][license-url]
[![Code Style][code-style-image]][code-style-url]

> Application for Managing Firebase Applications. Includes support for multiple environments and data migrations

## Table of Contents
1. [Features](#features)
1. [Getting Started](#getting-started)
1. [NPM Scripts](#npm-scripts)
1. [Application Structure](#application-structure)
1. [Run Your Own](#run-your-own)
  1. [Requirements](#requirements)
  1. [Before Starting](#before-starting)
1. [Testing](#testing)
  1. [Cloud Functions Unit](#cloud-functions-unit-tests)
  1. [App E2E](#app-e2e)
1. [Deployment](#deployment)
1. [FAQ](#faq)

## Features
* Manage multiple environments as a single project
* Project Sharing (invite by email coming soon)
* "Action Runner" for common project actions such as data migrations, and generating reports
* Action Features include support for:
  * Multiple steps allowing many actions in one run
  * Backup phase (for easy backing up data before running your actions)
  * Custom logic (JS written in the browser with ESNext features like `async/await`)
* Project level tracking of actions which have been run through Action Runner
* Get/Set CORS Config of Storage Buckets
* Testing for React App (Cypress) and Cloud Functions (Mocha)

*coming soon*
* Support for copying Single Firestore Document in Copy Action
* Map action - for mapping each item in a collection both on RTDB and Firestore
* Authorized Google API Request Panel
* Invite new users by email
* User manager (including role assignment)
* Data Viewer

Interested in adding a feature or contributing? Open an issue or [reach out over gitter](https://gitter.im/firebase-admin/Lobby).

## Getting Started

Checkout the [hosted version available at fireadmin.io](http://fireadmin.io). After you become more familiar, feel free to run your own by pulling this source and proceeding to the [run your own section](#run-your-own).

### NPM Scripts

While developing, you will probably rely mostly on `npm start`; however, there are additional scripts at your disposal:

|`npm run <script>`    |Description|
|-------------------|-----------|
|`start`            |Serves your app at `localhost:3000` and displays [Webpack Dashboard](https://github.com/FormidableLabs/webpack-dashboard)|
|`start:simple`     |Serves your app at `localhost:3000` without [Webpack Dashboard](https://github.com/FormidableLabs/webpack-dashboard)|
|`start:dist`       |Builds the application to ./dist and Serves it at `localhost:3000` using `firebase serve`|
|`functions:start`  |Runs Functions locally using `firebase functions:shell`|
|`functions:build`  |Builds Cloud Functions to ./functions/dist|
|`functions:test`   |Runs Functions Unit Tests with Mocha|
|`build`            |Builds the application to ./dist|
|`test`             |Runs E2E Tests with Cypress. See [testing](#testing)|
|`lint`             |[Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors|
|`lint:fix`         |Lints the project and [fixes all correctable errors](http://eslint.org/docs/user-guide/command-line-interface.html#fix)|

[Husky](https://github.com/typicode/husky) is used to enable `prepush` hook capability. The `prepush` script currently runs `eslint`, which will keep you from pushing if there is any lint within your code. If you would like to disable this, remove the `prepush` script from the `package.json`.

## Application Structure

```
├── bin                      # Scripts called from the command line
│   └── firebase-extra.js    # Script called by tests to seed/clear Firebase
├── build                    # All build-related configuration
│   └── webpack.config.js    # Environment-specific configuration files for webpack
├── server                   # Express application that provides webpack middleware
│   └── main.js              # Server application entry point
├── functions                # Cloud Functions (uses Cloud Functions for Firebase)
│   └── index.js             # Functions entry point
├── src                      # Application source code
│   ├── index.html           # Main HTML page container for app
│   ├── main.js              # Application bootstrap and rendering
│   ├── normalize.js         # Browser normalization and polyfills
│   ├── components           # Global Reusable Presentational Components
│   ├── containers           # Global Reusable Container Components
│   ├── layouts              # Components that dictate major page structure
│   │   └── CoreLayout       # Global application layout in which to render routes
│   ├── routes               # Main route definitions and async split points
│   │   ├── index.js         # Bootstrap main application routes with store
│   │   └── Home             # Fractal route
│   │       ├── index.js     # Route definitions and async split points
│   │       ├── assets       # Assets required to render components
│   │       ├── components   # Presentational React Components
│   │       ├── container    # Connect components to actions and store
│   │       ├── modules      # Collections of reducers/constants/actions
│   │       └── routes **    # Fractal sub-routes (** optional)
│   ├── static               # Static assets
│   ├── store                # Redux-specific pieces
│   │   ├── createStore.js   # Create and instrument redux store
│   │   └── reducers.js      # Reducer registry and injection
│   └── styles               # Application-wide styles (generally settings)
├── project.config.js        # Project configuration settings (includes ci settings)
├── test                     # App Tests
│   └── unit                 # Unit tests
```

## Run Your Own

### Requirements
* node `^6.14.0` (`8.11.3` suggested for function to match [Cloud Functions Runtime][functions-runtime-url])

### Before Starting

1. Make sure you have enabled billing on your Firebase account - external API communication requires setting up a payment method (you are only charged based on usage)
1. Create an account on Algolia - Create a new app, you will need the API keys later
1. Install Firebase Command Line Tools: `npm i -g firebase-tools`

### Local Environment Setup
1. Install dependencies: `npm install`
1. Look for a `src/config.js` file. If one doesn't exist, create it to look like so (this is generated using [`firebase-ci`](https://www.npmjs.com/package/firebase-ci) in CI environments):

    ```js
    export const version = "0.*.*"; // matches package.json when using firebase-ci in CI environment

    export const env = "local"; // matches branch/project alias when using firebase-ci in CI environment

    // Get from Auth Tab with Firebase's Console
    // matches branch/project settings when using firebase-ci in CI environment
    export const firebase = {
      apiKey: "<- api key ->",
      authDomain: "<- auth domain ->",
      databaseURL: "<- database URL ->",
      projectId: "<- project ID ->",
      storageBucket: "<- storageBucket ->",
      messagingSenderId: "<- message sender ID ->",
    };

    export const reduxFirebase = {
      userProfile: "users",
      enableLogging: false,
      updateProfileOnLogin: true,
      useFirestoreForProfile: true,
    };

    // Google Analytics Tracking ID (leave blank for no analytics)
    export const analyticsTrackingId = "<- your analytics tracking id ->";

    // Stackdriver client side error reporting (leave blank for no client side error reporting)
    export const googleApis = {
      apiKey: "<- your API Key for Google APIs ->",
    };

    // Algolia project info (for searching of User's Public Info and Public Templates)
    export const algolia = {
      appId: "<- your algolia app id ->",
      apiKey: "<- your algolia apiKey ->",
    };

    export default {
      version,
      env,
      firebase,
      reduxFirebase,
      analyticsTrackingId,
      googleApis,
      algolia
    }
    ```
1. Create `functions/.runtimeconfig.json` file that looks like so:

    ```json
    {
      "algolia": {
        "api_key": "<- your API KEY ->",
        "app_id": "<- your Algolia APP ID ->"
      },
      "gmail": {
        "email": "<- gmail account for sending invite emails ->",
        "password": "<- password for ^ email ->"
      },
      "encryption": {
        "password": "<- your own made up encryption password for service accounts -> "
      }
    }
    ```
1. Set Functions config variables to match the file you just made (for the deployed version of your functions):

    __Required Variables__
    ```bash
    firebase functions:config:set algolia.api_key="<- your algolia api key ->" algolia.api_key="<- your algolia api key ->"\
    encryption.password="somePassword"
    ```

    __Optional__
    ```bash
    firebase functions:config:set gmail.email="<- inviter gmail account ->" gmail.password="<- password of inviter account ->"
    ```
1. Build Project: `npm run build`
1. Deploy to Firebase: `firebase deploy` (deploys, Cloud Functions, Rules, and Hosting)
1. Start Development server: `npm start`
    **NOTE:** You can also use `npm run start:dist` to test how your application will work when deployed to Firebase
1. View the deployed version of the site by running `firebase open hosting:site`

### Deployment

#### CI Deploy (recommended)
**Note**: Config for this is located within `.gitlab-ci.yml`. `firebase-ci` has been added to simplify the CI deployment process by getting settings from the `.firebaserc`. All that is required is providing authentication with Firebase:

1. Have at least two Firebase projects to ready to use, one for each environment (staging and production)
1. Replace info within `.firebaserc` under both the `projects` and `ci` sections
1. Replace environment settings within `.gitlab-ci.yml` with your own. This will make the "Operations" tab of Gitlab point to your environment URLs.
1. Login: `firebase login:ci` to generate an authentication token. This token will be used to give the CI provider rights to deploy on your behalf. Settings are provided for Gitlab, but any CI provider can be used.
1. Set `FIREBASE_TOKEN` environment variable within Gitlab-CI environment variables
1. Add the following environment variables to Gitlab-CI's variables (within `/settings/ci_cd`):
    ```js
    FIREBASE_TOKEN // Used to deploy to Firebase (token generated in last step)
    /* Stage Vars */
    STAGE_FIREBASE_API_KEY // apiKey staging project (from Firebase Auth Tab)
    STAGE_ALGOLIA_APP_ID // algolia app_id of staging project
    STAGE_ALGOLIA_BROWSER_KEY // algolia browser_key of staging project
    /* Prod Vars */
    PROD_FIREBASE_API_KEY // apiKey staging project (from Firebase Auth Tab)
    PROD_ALGOLIA_APP_ID // algolia app_id of staging project
    PROD_ALGOLIA_BROWSER_KEY // algolia browser_key of staging project
    /* Optional */
    SENTRY_DSN // Sentry DSN for error tracking
    STAGE_GOOGLE_API_KEY // API Key for Stackdriver error logging (can use firebase apiKey)
    PROD_GOOGLE_API_KEY // API Key for Stackdriver error logging (can use firebase apiKey)
    ```
1. Run a build on Gitlab-CI by pushing code to your Git remote (most likely Github)

For more options on CI settings checkout the [firebase-ci docs](https://github.com/prescottprue/firebase-ci).

#### Manual deploy

1. Make sure you have created a `src/config.js` file as mentioned above
1. Initialize project with `firebase init` then answer:
  * What file should be used for Database Rules?  -> `database.rules.json`
  * What do you want to use as your public directory? -> `build`
  * Configure as a single-page app (rewrite all urls to /index.html)? -> `Yes`
  * What Firebase project do you want to associate as default?  -> **your Firebase project name**
1. Build Project: `npm run build`
1. Confirm Firebase config by running locally: `firebase serve`
1. Deploy to firebase: `firebase deploy`
**NOTE:** You can use `firebase serve` to test how your application will work when deployed to Firebase, but make sure you run `npm run build` first.

### Testing
**NOTE**: If you have setup CI deployment, [E2E tests](#app-e2e-tests) and [Unit Tests](#cloud-functions-unit-tests) can automatically run against your staging environment before running the production build.

#### Cloud Functions Unit Tests
Cloud Functions Unit tests are written in [Mocha](https://github.com/mochajs/mocha) with code coverage generated by [Istanbul](https://github.com/gotwarlost/istanbul). These tests cover "backend functionality" handled by Cloud Functions by stubbing the functions environment (including dependencies).

##### Run Locally
1. Go into the functions folder: `cd functions`
1. Confirm you have dependencies installed: `npm i`
1. Run unit tests: `npm test`
1. To also generate coverage while testing, run `npm run test:cov`

#### App E2E Tests
End to End tests are done using [Cypress](https://cypress.io) and they live within the `test/e2e` folder. These tests cover UI functionality and are run directly on the hosted environment of Fireadmin. Application end to end tests are run automatically in Gitlab-CI the after deploying to the staging environment before deploying to production.

##### Run Locally
1. Create a service account within the Firebase console
1. Save the service account as `serviceAccount.json` within the root of the project
1. Get the UID of the user that you want to use while testing from the Authentication tab of the Firebase console to
1. Create a `test/e2e/config.json` with the following format:
    ```json
    {
      "TEST_UID": "<- user account's UID ->",
      "FIREBASE_PROJECT_ID": "<- your projectId ->",
      "FIREBASE_API_KEY": "<- your firebase apiKey ->"
    }
    ```
1. Run `npm run start:dist`. This will:
    1. Build the React app to the `dist` folder
    1. Host the build app on a local server using `firebase serve`
1. In a different terminal tab, run `npm run test:ui`. This will:
    1. Create test environment configuration (includes JWT created using service account)
    1. Open Cypress's local test runner UI where you can run single tests or all tests

NOTE: `npm run start:dist` is used to start the local server in the example above for speed while running all tests. If you are developing the application while re-running a single test, or just a few, you can use `npm run start` instead.

## FAQ

1. Why node `8.11.3` instead of a newer version?
  [Cloud Functions runtime supports `6` or `8`][functions-runtime-url], which is why that is what is used for the CI build version. This will be switched when the functions runtime is updated
1. Uploading service accounts? Where do they go and how are my service accounts stored?
  Currently on a Google Cloud Storage Bucket which has security rules and does not have CORS access. As soon as the file has been converted into an encrypted string and stored within Firestore, it is removed from Cloud Storage.

[functions-runtime-url]: https://cloud.google.com/functions/docs/writing/#the_cloud_functions_runtime
[npm-image]: https://img.shields.io/npm/v/fireadmin.svg?style=flat-square
[npm-url]: https://npmjs.org/package/fireadmin
[travis-image]: https://img.shields.io/travis/prescottprue/fireadmin/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/prescottprue/fireadmin
[daviddm-image]: https://img.shields.io/david/prescottprue/fireadmin.svg?style=flat-square
[daviddm-url]: https://david-dm.org/prescottprue/fireadmin
[climate-image]: https://img.shields.io/codeclimate/github/prescottprue/fireadmin.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/prescottprue/fireadmin
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/prescottprue/fireadmin.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/prescottprue/fireadmin
[license-image]: https://img.shields.io/npm/l/fireadmin.svg?style=flat-square
[license-url]: https://github.com/prescottprue/fireadmin/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
