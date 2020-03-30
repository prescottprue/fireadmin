---
title: Cloud Functions
slug: testing/cloud-functions
type: page
order: 1
language: en
tags:
  - testing
---

Tests for Cloud functions are written using Mocha/Chai. They [live within the `functions/test` folder](https://github.com/prescottprue/fireadmin/tree/master/functions/test).

## Running Locally

Unit tests are run through mocha when calling:

```bash
yarn functions:test
```

**Note:** Coverage is genearted when running:

```bash
yarn functions:test:cov
```

## Writing

How you write your tests for cloud functions depends on the scope you would like to cover in your test.
[the vanilla js testing section](/images/FiradminLogo.png)

### Logic

As mentioned in [the vanilla js testing section](/testing/vanilla-js), we can tests simple logic directly with mocha/chai.

### Full Cloud Function

Testing is slightly different between [HTTP functions](https://firebase.google.com/docs/functions/unit-testing#testing_http_functions) and [other function types](https://firebase.google.com/docs/functions/unit-testing#testing_background_non-http_functions)

Everything in tests can be mocked including Database updates and external API calls

- [PubSub Function Test Example](https://github.com/prescottprue/fireadmin/blob/master/functions/test/unit/sendFcm.spec.js)
- [RTDB Function Test Example](https://github.com/prescottprue/fireadmin/blob/master/functions/test/unit/callGoogleApi.spec.js) (has external API calls which use HTTP mocked with [`fauxJax`][faux-jax-url])
- [HTTP Function Test Example](https://github.com/prescottprue/fireadmin/blob/master/functions/test/unit/version.spec.js)

## Other Resources

- [Unit testing of Cloud Functions  |  Firebase](https://firebase.google.com/docs/functions/unit-testing)
- [faux-jax][faux-jax-url] for mocking http

[faux-jax-url]: https://github.com/algolia/faux-jax
