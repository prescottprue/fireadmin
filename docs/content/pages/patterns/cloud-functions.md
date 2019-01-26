---
title: Cloud Functions Patterns
slug: patterns/cloud-functions
type: page
language: en
tags:
  - patterns
---

Below are our patterns for writing Cloud Functions. Our main Cloud Functions [live within the `horchata` repo](https://github.com/fireadmin/horchata/tree/master/functions).

## Dependencies

* Update to beyond functions v1 (more about the differences available in [the firebase docs outlines it](https://firebase.google.com/docs/functions/beta-v1-diff)
  * auth context is available as part of event
  * Testing `firebase-functions-test` (which help wraps functions to help mocking)
* Submodules should be handled correctly - lambda-ghostscript causes local functions emulation to take longer to boot

### Config/Initialization

**Get From Environment**

All config (even service account) should be loaded from environment config instead of files

  ```js
  // DO NOT DO THIS
  const serviceAccount = require('./serviceAccount.json')

  // DO THIS INSTEAD
  const serviceAccount = getEnvConfig('service_account')
  ```

**Check For Existence**
Getting config vars should be protected by existence checking - `getEnvConfig` function provided to simplify

  ```js
  // DO NOT DO THIS
  const serviceAccountConf = functions.config().serviceAccount

  // DO THIS INSTEAD
  const serviceAccountConf = getEnvConfig('serviceAccount')
  ```

**Not In Global**
Usage of config variables should not within the global functions scope. This is because deploying becomes broken on all environments that don’t have it setup (i.e trying to deploy to your local when have not setup reside libraries).

  ```js
  // DO NOT DO THIS
  const serviceAccountConf = functions.config().serviceAccount

  // DO THIS INSTEAD
  function doSomething() {
    const serviceAccountConf = getEnvConfig('serviceAccount')
    // logic that uses serviceAccountConf
  }
  ```

**NOTE** Variables do not need to contain the word "config"

## Cloud Storage Interaction
Get the bucket from the admin instance which is already initialized:

  ```js
  import * as admin from 'firebase-admin'

  const bucket = admin.storage().bucket()
  bucket.file()
  ```

Can also be used for other buckets:

```js
import * as admin from 'firebase-admin'

const otherBucket = admin.storage().bucket('other-bucket')
otherBucket.file()
```

## Async Logic

* Use `async` functions so that `await` can be used
* Use `to` from `utils/async` to prevent nested try/catches
* Break each stage up so that top level function reads clearly

```js
import { to } from 'utils/async';

// Write error to response object
const [writeErr] = await to(
  admin.database().ref('responses/asdf').set({
    processed: true,
    error: errMsg,
    processing: false,
  })
);

// Handle errors writing error response to RTDB
if (writeErr) {
  console.error(
    `Error writing error response to RTDB: ${writeErr.message || ''}`,
    writeErr
  );
  throw writeErr;
}
```