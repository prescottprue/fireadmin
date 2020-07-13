# fireadmin

[![Build Status][build-status-image]][build-status-url]
[![Cypress Dashboard][cypress-dashboard-image]][cypress-dashboard-url]
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
1. [App E2E](#app-e2e-tests)
1. [Deployment](#deployment)
1. [FAQ](#faq)

## Features

- Manage multiple environments as a single project
- Project Sharing (invite by email coming soon)
- "Action Runner" for common project actions such as data migrations, and generating reports
- Action Features include support for:
  - Multiple steps allowing many actions in one run
  - Backup phase (for easy backing up data before running your actions)
  - Custom logic (JS written in the browser with ESNext features like `async/await`)
- Project level tracking of actions which have been run through Action Runner
- Get/Set CORS Config of Storage Buckets
- Testing for React App (Cypress) and Cloud Functions (Mocha)

_coming soon_

- Support for copying Single Firestore Document in Copy Action
- Map action - for mapping each item in a collection both on RTDB and Firestore
- Authorized Google API Request Panel
- Invite new users by email
- User manager (including role assignment)
- Data Viewer

Interested in adding a feature or contributing? Please open an issue!

## Getting Started

Since this is source code, a great place to start is checking the [hosted version of Fireadmin available at fireadmin.io](http://fireadmin.io).

### NPM Scripts

While developing, you will probably rely mostly on `npm start`; however, there are additional scripts at your disposal:

| `npm run <script>` | Description                                                                                                               |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| `start`            | Serves your app at `localhost:3000` and displays [Webpack Dashboard](https://github.com/FormidableLabs/webpack-dashboard) |
| `start:simple`     | Serves your app at `localhost:3000` without [Webpack Dashboard](https://github.com/FormidableLabs/webpack-dashboard)      |
| `start:dist`       | Builds the application to ./dist and Serves it at `localhost:3000` using `firebase serve`                                 |
| `functions:start`  | Runs Functions locally using `firebase functions:shell`                                                                   |
| `functions:build`  | Builds Cloud Functions to ./functions/dist                                                                                |
| `functions:test`   | Runs Functions Unit Tests with Mocha                                                                                      |
| `build`            | Builds the application to ./dist                                                                                          |
| `test`             | Runs E2E Tests with Cypress. See [testing](#testing)                                                                      |
| `lint`             | [Lints](http://stackoverflow.com/questions/8503559/what-is-linting) the project for potential errors                      |
| `lint:fix`         | Lints the project and [fixes all correctable errors](http://eslint.org/docs/user-guide/command-line-interface.html#fix)   |

[Husky](https://github.com/typicode/husky) is used to enable `prepush` hook capability. The `prepush` script currently runs `eslint`, which will keep you from pushing if there is any lint within your code. If you would like to disable this, remove the `prepush` script from the `package.json`.

## Application Structure

```
├── .github                      # Github Settings + Github Actions Workflows
│   ├── deploy.yml               # Deploy workflow (called on merges to "master" and "production" branches)
│   └── verify.yml               # Verify workflow (run when PR is created)
├── cypress                      # UI Integration Tests
├── docs                         # Docs application (built with Gatsby)
│   ├── content                  # Content of docs (written in markdown)
│   ├── components               # React components used in docs app
│   ├── gatsby-config.js         # Gatsby plugin settings
│   └── gatsby-node.js           # Gatsby node definitions (how templates are combined with content)
│   └── package.json             # Docs package file (docs specific dependencies)
├── functions                    # Cloud Functions (uses Cloud Functions for Firebase)
│   ├── src                      # Cloud Functions Source code (each folder represents a function)
│   └── index.js                 # Functions entry point
├── public                       # Public assets
│   ├── favicon.ico              # Favicon
│   ├── firebase-messaging.sw.js # Messaging Service worker (loaded by Firebase SDK)
│   └── index.html               # Main HTML page container for app
├── src                          # Application source code
│   ├── components               # Global Reusable Presentational Components
│   ├── containers               # Global Reusable Container Components
│   ├── layouts                  # Components that dictate major page structure
│   │   └── CoreLayout           # Global application layout in which to render routes
│   ├── routes                   # Main route definitions and async split points
│   │   ├── index.js             # Bootstrap main application routes with store
│   │   └── Home                 # Fractal route
│   │       ├── index.js         # Route definitions and async split points
│   │       ├── assets           # Assets required to render components
│   │       ├── components       # Presentational React Components
│   │       ├── modules          # Collections of reducers/constants/actions
│   │       └── routes **        # Fractal sub-routes (** optional)
│   ├── static                   # Static assets
│   └── utils                    # Application-wide utils (form validation etc)
├── .firebaserc                  # Firebase project settings (including settings for CI deployment)
├── cypress.json                 # Cypress Integration Test settings
├── database.rules.json          # Firebase Real Time Database Rules
├── firebase.json                # Firebase resource settings (including which folders are deployed)
├── firestore.indexes.json       # Firestore Indexes
├── firestore.rules              # Firestore Database Rules
└── storage.rules                # Cloud Storage Rules
```

## Run Your Own

### Requirements

- node `^10.18.0` (node 10 suggested in order to match newest [Cloud Functions Runtime][functions-runtime-url])

### Before Starting

1. Make sure you have enabled billing on your Firebase account - external API communication requires setting up a payment method (you are only charged based on usage)
1. Create an account on Algolia - Create a new app, you will need the API keys later
1. Install Firebase Command Line Tools: `npm i -g firebase-tools`

### Local Environment Setup

1. Install dependencies: `yarn install`
1. Create a Web app within the Firebase Console of your project (config will be used in next step)
1. Create a `.env.local` that has the following format (with your values filled from previous step):

   ```bash
   REACT_APP_FIREBASE_apiKey=<- api key ->
   REACT_APP_FIREBASE_authDomain=<- auth domain ->
   REACT_APP_FIREBASE_databaseURL=<- database URL ->
   REACT_APP_FIREBASE_projectId=<- project ID ->
   REACT_APP_FIREBASE_storageBucket=<- storageBucket ->
   REACT_APP_FIREBASE_messagingSenderId=<- message sender ID ->
   REACT_APP_FIREBASE_appId=<- project app id ->
   REACT_APP_FIREBASE_PUBLIC_VAPID_KEY=<- project app id ->
   REACT_APP_ALGOLIA_APP_ID=<- ->
   REACT_APP_ALGOLIA_API_KEY=<- ->
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

   **Required Variables**

   ```bash
   firebase functions:config:set algolia.api_key="<- your algolia api key ->" algolia.api_key="<- your algolia api key ->"\
   encryption.password="somePassword"
   ```

   **Optional**

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

**Note**: Config for this is located within `.github/workflows/app-deploy.yml`. `firebase-ci` has been added to simplify the CI deployment process by getting settings from the `.firebaserc`. All that is required is providing authentication with Firebase:

1. Have at least two Firebase projects to ready to use, one for each environment (staging and production)
1. Replace info within `.firebaserc` under both the `projects`, `ci`, and `targets` sections
1. Login: `firebase login:ci` to generate an authentication token. This token will be used to give the CI provider rights to deploy on your behalf. Settings are provided for Gitlab, but any CI provider can be used.
1. Set `FIREBASE_TOKEN` environment variable within Github Actions secrets
1. Add the following environment variables to Github Actions's variables (within `/settings/ci_cd`):

   ```js
   FIREBASE_TOKEN; // Used to deploy to Firebase (token generated in last step)
   CYPRESS_RECORD_KEY; // Record key for Cypress Dashboard
   SERVICE_ACCOUNT; // Used to authenticate with database to run hosted tests
   ```

1. Run a build on Github Actions by pushing code to your Git remote (most likely Github)

For more options on CI settings checkout the [firebase-ci docs](https://github.com/prescottprue/firebase-ci).

#### Manual deploy

1. Make sure you have created a `src/config.js` file as mentioned above
1. Initialize project with `firebase init` then answer:

- What file should be used for Database Rules? -> `database.rules.json`
- What do you want to use as your public directory? -> `build`
- Configure as a single-page app (rewrite all urls to /index.html)? -> `Yes`
- What Firebase project do you want to associate as default? -> **your Firebase project name**

1. Build Project: `npm run build`
1. Confirm Firebase config by running locally: `firebase serve`
1. Deploy to firebase: `firebase deploy`
   **NOTE:** You can use `firebase serve` to test how your application will work when deployed to Firebase, but make sure you run `npm run build` first.

### Docs

Documentation is available at [fireadmin.io/docs](https://fireadmin.io/docs)

All source code and content for docs is located within the [`docs`](/docs) folder. Docs are generated from markdown into static files using Gatsby [based on settings in `gatsby-config.js`](/docs/gatsby-config.js).

Visit the [docs README for more info](/docs/README.md).

### Testing

**NOTE**: If you have setup CI deployment, [E2E tests](#app-e2e-tests) and [Unit Tests](#cloud-functions-unit-tests) can automatically run against your staging environment before running the production build.

#### Cloud Functions Unit Tests

Cloud Functions Unit tests are written in [Mocha](https://github.com/mochajs/mocha) with code coverage generated by [Istanbul](https://github.com/gotwarlost/istanbul). These tests cover "backend functionality" handled by Cloud Functions by stubbing the functions environment (including dependencies).

##### Run Locally

1. Go into the functions folder: `cd functions`
1. Confirm you have dependencies installed: `npm i`
1. Run unit tests: `npm test`
1. To also generate coverage while testing, run `npm run test:cov`

#### App UI Tests

End to End tests are done using [Cypress](https://cypress.io) and they live within the `cypress` folder. These tests cover UI functionality and are run directly on the hosted environment of Fireadmin. Application end to end tests are run automatically in Github Actions the after deploying to the staging environment before deploying to production.

##### Run Locally

1. Create a service account within the Firebase console
1. Save the service account as `serviceAccount.json` within the root of the project
1. Get the UID of the user that you want to use while testing from the Authentication tab of the Firebase console to
1. Create `cyress.env.json` with the following format:

   ```json
   {
     "TEST_UID": "<- user account's UID ->"
   }
   ```

1. Run `npm run start:dist`. This will:
   1. Build the React app to the `dist` folder
   1. Host the build app on a local server using `firebase serve`
1. In a different terminal tab, run `npm run test:ui`. This will:
   1. Create test environment configuration (includes JWT created using service account)
   1. Run Cypress tests locally through cli

To Open Cypress's local test runner UI where you can run single tests or all tests use `npm run test:ui:open`.

NOTE: `npm run start:dist` is used to start the local server in the example above for speed while running all tests. If you are developing the application while re-running a single test, or just a few, you can use `npm run start` instead.

## FAQ

1. Why node `10.18.0` instead of a newer version?
   [Cloud Functions runtime supports `8` or `10`][functions-runtime-url], which is why that is what is used for the CI build version. This will be switched when the functions runtime is updated
1. Uploading service accounts? Where do they go and how are my service accounts stored?
   When uploading a service account, it first goes to a Google Cloud Storage Bucket which [has security rules](/storage.rules) and does not have CORS access. The [copyServiceAccountToFirestore Cloud Function](/functions/src/copyServiceAccountToFirestore) converts it into an encrypted string, stores it within Firestore, then removes the original file from Cloud Storage. Firestore rules keep anyone that is not a collaborator on your project using or reading the service account. Since it is associated with a specific environment, you can then limit access to what can be done with it right in the Users/Permissions tab of Fireadmin.

[functions-runtime-url]: https://cloud.google.com/functions/docs/concepts/exec
[build-status-url]: https://github.com/prescottprue/fireadmin/actions
[build-status-image]: https://img.shields.io/github/workflow/status/prescottprue/fireadmin/Verify%20App?style=flat-square
[cypress-dashboard-image]: https://img.shields.io/static/v1?label=Cypress&message=Dashboard&color=00BF88&style=flat-square
[cypress-dashboard-url]: https://dashboard.cypress.io/projects/6my6ku/runs
[climate-image]: https://img.shields.io/codeclimate/github/prescottprue/fireadmin.svg?style=flat-square
[climate-url]: https://codeclimate.com/github/prescottprue/fireadmin
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/prescottprue/fireadmin.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/prescottprue/fireadmin
[license-image]: https://img.shields.io/npm/l/fireadmin.svg?style=flat-square
[license-url]: https://github.com/prescottprue/fireadmin/blob/master/LICENSE
[code-style-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[code-style-url]: http://standardjs.com/
[main-workflow-badge]: https://github.com/prescottprue/fireadmin/workflows/main/badge.svg?branch=github-actions
[main-workflow-url]: https://github.com/prescottprue/fireadmin/workflows/main/badge.svg
