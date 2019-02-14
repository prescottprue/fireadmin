---
title: Web UI
slug: testing/ui
type: page
language: en
tags:
  - testing
---

End to testing is done with [Cypress](https://cypress.io).

## Run Locally

### Setup

NOTE: Setup requires a seviceAccount.json file, if you have not already created one, visit the Getting Started section to find out how.

1. Create a service account within the Firebase console
2. Save the service account as `serviceAccount.json` within the root of the project
3. Get the UID of the user that you want to use while testing from the Authentication tab of the Firebase console to
4. Create a `cypress/config.json` with the following format:
  ```js
    {
      "TEST_UID": "<- user account's UID ->",
      "FIREBASE_PROJECT_ID": "<- your projectId ->",
      "FIREBASE_API_KEY": "<- your firebase apiKey ->"
    }
  ```
1. Run `yarn test:ui`

That will open Cypress's local test runner UI where you can run single tests or all tests. In the background a JWT was generated for the user which you provided the UID for.

### Locally
Running tests locally requires starting a server with a local version of the app you are testing.

Run the app locally with the following:

  ```bash
  yarn start
  ```

Then start the cypress local test runner ui by running the following in a new terminal:

  ```bash
  yarn test:ui
  ```

NOTE: If you are actively developing the app you are testing, it is also possible to run `yarn start` instead of `yarn start:dist`, but this causes tests to time out much more often. This is due to the fact that the dev setup (non minified bundle, hot module reloading) takes much longer to load in the browser than the built version.

### Remotely

Visit [Barista](https://barista-stage.firebaseapp.com)

## Writing UI Tests

# Writing Cypress Tests

## UI E2E
### File/Folder Structure
```
├── test
│   └── e2e                    # End To End Test Folder
│       ├── fixtures           # Fake data to be used within tests
│       ├── plugins            # Cypress Plugins (reacting to emitted events)
│       │   └── index.js
│       ├── support            # Global Code Applied to Cypress
│       │   └── index.js
│       ├── utils              # Utilties shared between custom commands, plugins, and tests
│       │   └── index.js
│       ├── integration        # Tests folder
│       │   └── Some.spec.js   # Test files ending in .spec.js
│       ├── config.json        # Config for generating test environment (contains UID of)
│       └── Dockerfile         # Docker image used by Barista to run tests
├── cypress.json               # Cypress configuration (including defaults)
├── cloudbuild-e2e.yaml              # Cypress configuration (including defaults)
└── serviceAccount.json        # Service Account From Firebase/Google Project
```

### Selectors

Use the `data-test` attribute to make it so your tests can easily select the element from the DOM:

```js
<div data-test="some-feature">
  Words Inside
</div>
```

Then in tests confirm:

**Element Has Content**

```js
cy.get(createSelector('some-feature')).should('have.value', 'Words Inside')
```

**Input Has Partial Value**
```js
cy.get('input').invoke('val').should('contain', 'partial')
// or
cy.get('input').then($input => {
  expect($input.val()).to.contain('partial')
})
```

**Multiple Element Assertions**

```js
cy.get(createSelector('some-feature')).should(($divs) => {
  expect($divs).to.have.length(1) // only one element matching selector
  expect($divs.first()).to.contain('Words Inside') // matching div contains expected text
})
```

### Tagging/Grouping
Single test files can be run by adding them to a group. To add a group, visit `/testGroups` and click "Create Test Group".

### Recipes

#### Basic Test

```js
import { createSelector } from '../utils'

describe('Home Page', () => {
  // Setup before tests including creating a server to listen for external requests
  before(() => {
    // Go to home page
    cy.visit('/')
  })

  it('shows a "testGroups" button goes to projects page', () => {
    cy.get(createSelector('feature-testGroups')).click()
  })
})
```

#### Test Requiring Auth
Use `cy.login` in `before` to auth as qa user before all tests and place `cy.logout` in `after` to logout after.

```js
import { createSelector } from '../utils'

describe('Projects Page', () => {
  before(() => {
    // Login using custom token
    cy.login()
  })
    
  after(() => {
    // Logout to cleaup auth state
    cy.logout()
  })
  
  beforeEach(() => {
    // Start at listings page
    cy.visit('/transactions/listings')
  })
})
```

#### Seed Database With Data

Placing data within the database before running a test, or "seeding", is a key piece of having tests stand free from each other. `callRtdb` and `callFirestore` use admin credentials, so it is not nessesary to call `cy.login` before using them.

```js
import { createSelector } from '../utils'
import { PROPERTY } from '../fixtures/transaction'
import { DOC } from '../fixtures/transactionDocs'

const TEST_TRANSACTION_ID = '123abc'
const TEST_TRANSACTION_PATH = `transactions/listings/${TEST_TRANSACTION_ID}`
const TEST_TRANSACTION_DOCS_PATH = `transactions_docs/listings/${TEST_TRANSACTION_ID}`
const fakeTransaction = { property: PROPERTY }
const fakeTransactionDocs = [DOC]

describe('Listings Page', () => {
  beforeEach(() => {
    // Set transaction documents to Real Time Database
    cy.callRtdb('set', TEST_TRANSACTION_DOCS_PATH, fakeTransactionDocs)
    // Set listing to Real Time Database with meta (createdAt and createdBy)
    cy.callRtdb('set', TEST_TRANSACTION_PATH, fakeTransaction, { withMeta: true })
    // Login using custom token (Not needed for callRtdb)
    cy.login()
    // Go to listings page
    cy.visit('/transactions/listings')
  })

  afterEach(() => {
    // Remove project to cleanup
    cy.callRtdb('remove', TEST_TRANSACTION_PATH)
  })

  it('Edit button opens listing', () => {
    // Click on the new project edit button
    cy.get(createSelector('edit-button')).first().click()
    cy.url().should('include', TEST_TRANSACTION_PATH)
  })
})
```

#### Verify App Writes Data To Database

**Real Time Database**

```js
import { createSelector } from '../utils'
const TEST_TRANSACTION_PATH = 'transactions/listings/123abc'

describe('Listings Page', () => {
  beforeEach(() => {
    // Login using custom token
    cy.login()
    // Go to listings page
    cy.visit('/transactions/listings')
  })

  afterEach(() => {
    // Remove project to cleanup
    cy.callRtdb('remove', TEST_TRANSACTION_PATH)
  })

  it('Creates a new Listing created by the current user', () => {
    // Click to create new transaction
    cy.get(createSelector('new-transaction-button')).click()
    // Confirm that the new project contains createdBy
    cy.callRtdb('get', TEST_TRANSACTION_PATH)
      .then((project) => {
        // Confirm new  has name
        cy.wrap(project)
          .its('createdBy')
          .should('equal', Cypress.env('TEST_UID'))
      })
  })
})
```

**Firestore**

```js
import { createSelector } from '../utils'
const TEST_TRANSACTION_ID = '123abc'

describe('Listings Page', () => {
  beforeEach(() => {
    // Login using custom token
    cy.login()
    // Go to listings page
    cy.visit('/transactions/listings')
  })

  afterEach(() => {
    // Remove project to cleanup
    cy.callFirestore('delete', 'projects', {
      where: [
        ['createdBy', '==', Cypress.env('TEST_UID')],
        ['name', '==', 'Test project']
      ],
      limit: 1
    })
  })

  it('Creates a new Listing created by the current user', () => {
    // Click to create new transaction
    cy.get(createSelector('new-transaction-button')).click()
    // Confirm that the new project contains createdBy
    // Query database for the just created project
    cy.callFirestore('get', 'projects', {
      where: [
        ['createdBy', '==', Cypress.env('TEST_UID')],
        ['name', '==', 'Test project']
      ],
      limit: 1
    }).then(([project]) => {
      // Confirm project has name
      cy.wrap(project)
        .its('data.name')
        .should('equal', 'Test project')
    })
  })
})
```


## Custom Commands
Cypress supports creating your custom API through adding commands on the cypress object. We have already used this ability to add some commands which are outlined in the [existing commands section](#existing-commands).

For more details visit the [Cypress Docs on custom commands][cypress-custom-commands-url].

### Existing Commands
Some custom commands have been added to simplify writing tests with Firebase applications, they are documented below:

### Auth
* `cy.login()` - Login using UID provided in settings (qa@residebrokerage.com account is default)
* `cy.logout()` - Logout of currently authed Firebase instance

### File Uploading
* `cy.uploadFile()` - Upload a file to an uploader

### Database Communication
* `cy.callRtdb` - Make a call to Firebase Real Time Database with admin credentials
* `cy.callFirestore()` - Make a call to Firestore with admin credentials

### Adding A Custom Command
To add a custom command, use `Cypress.Commands.add`

```js
Cypress.Commands.add(
  'myFunc',
  (action, actionPath, fixturePath, opts = {}) => {
    cy.log('Some custom command!')
  }
)
```

Then use it in tests:

```js
cy.myFunc()
```

## Other Cypress Features

### Custom Listening/Labeling for external servers

```js
cy.server()
  // Firebase JS SDK request - Called when listener attached
  .route('POST', /google.firestore.v1beta1.Firestore\/Listen/)
  .as('listenForProjects')
  // Firebase JS SDK request - Called when data is returned
  .route('GET', /google.firestore.v1beta1.Firestore\/Listen/)
  .as('getProjectData')
  // Firebase JS SDK request - Called when project data is written
  .route('POST', /google.firestore.v1beta1.Firestore\/Write/)
  .as('addProject')
  .window()
  .then(win => {
    // Create a spy on the servers onOpen event so we can later expect
    // it to be called with specific arguments
    openSpy = cy.spy(cy.state('server').options, 'onOpen')
    return null
  })
```

[cypress-custom-commands-url]: https://docs.cypress.io/api/cypress-api/custom-commands.html#Syntax