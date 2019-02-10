---
title: Testing
slug: testing
type: page
language: en
tags:
  - testing
---

# Testing

The types of testing is often thought of as a spectrum. We will be covering the two ends of that spectrum, End To End Testing and Unit Testing

Horchata tests confirm that providing a request (db update or external request) - database and external services are correctly updated

## UI Tests (E2E)
UI tests confirm that they correctly write to DB (Cypress + `callFirestore` and `callRTDB`)

* [Writing E2E UI Tests](/testing/writing/ui)

## Code Tests (Unit)

Checking that specific code functions as expected. For example - providing a request (db update or external request) to a cloud function then confirming database and external services are correctly updated

* [Writing Unit Tests](/testing/writing/unit)
* [Cloud Functions Testing](/testing/cloud-functions)
