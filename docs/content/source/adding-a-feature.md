---
title: Adding Features
slug: source/adding-a-feature
type: page
language: en
tags:
  - source
---

Adding features is commonly done using some sort of scaffolding in tool, in our case we are using [the subgenerators from generator-react-firebase](https://github.com/prescottprue/generator-react-firebase#sub-generators) to add new features.

## React Components

### Top Level

Create a new component name "SomeComponent" by running:

```bash
yo react-firebase:component SomeComponent
```

### Nested

Create a new component name "SomeComponent" in `routes/Transaction/routes/Other/components` by running:

```bash
yo react-firebase:component SomeComponent routes/Transaction/routes/Other
```

## Cloud Functions

Create a new cloud function "someFunc" by running:

```bash
yo react-firebase:function someFunc
```

It creates

```txt
functions/someFunc/index.js
functions/test/someFunc/index.spec.js
```
