---
title: File Structure Patterns
slug: source/file-structure
type: page
language: en
tags:
  - source
---

Placement of files within a project repository is important, especially as the project scales. Below are our patterns for file structure organization:

## Components

##### Location

* Global: `src/components`
* Contained/In one route only: `src/routes/:routeName/components`

##### Creation

As noted in [the adding features](/coding-patterns/adding-features) we use the component subgenerator like so:

```bash
yo react-firebase:component
```

##### Handles

* All view layout/styling

##### Patterns

* Should be stateless \(just a function instead of a Class\)
* Should import styles from \`./SomeComponent.scss\` \(scss file named to match component\)

##### Example

`src/components/SomeComponent.js`:

```js
import React, { PropTypes } from 'react';
import classes from './SomeComponent.scss';

function SomeComponent({ someProp }) {
  return (
    <div>
      Some Component
    </div>
  );
}

SomeComponent.propTypes = {
  someProp: PropTypes.func.isRequired,
};

export default SomeComponent;
```

#### Approved file names by component

These are the only authorized files, anything that doesn't have a clear home should go in \*enhancer.js.  **_(Need to update the generator)_**

| Name | Purpose |
| --- | --- |
|	`Component.connect.js`	|	Data structuring. Connecting to firebase/firestore/redux and used for decorators like `withProps`	|
|	`Component.constants.js`	|	Contants specific to this component	|
|	`Component.enhancer.js`	|	Adds data and handling to the Component, importing the following files to do so: (ALSO THE CATCHALL)	|
|	`Component.handlers.js`	|	Action functions	|
|	`Component.js`	|	Functional React Component	|
|	`Component.lifecycle.js`	|	All lifecycle methods	|
|	`Component.readme.md`	|		|
|	`Component.scss`	|	Styles	|
|	`Component.selectors.js`	|	Reselect (re-reselect?) selectors - pure javascript - no react	|
|	`Component.spec.js`	|	Unit tests per component	|
|	`Component.stateHandlers.js`	|	Internal component state	|
|	`Component.stories.js`	|		|
|	`Component.styles.js`	|	JS Styles / MUI V1 stylesheets	|
|	`Component.utils.js`	|	Utils file	|
|	`index.js`	|	Exports the enhanced Component	|

### Routes

Async vs Sync definitions

##### Location
* Route Folder: `src/routes/SomeRoute`
* Components: `src/routes/SomeRoute/components/SomeComponent/SomeComponent.js`

##### Creation
Create a new container name "SomeRoute" by running \`redux g container SomeRoute\`

##### What they Handle

* Pages/Routes/Locations within app
* They can contain components, and modules

#### Children

##### Components

`components/SomeComponent/SomeComponent.js`

##### Routes

`index.js`


## Assets

##### Location

\`src/static\`

##### Patterns

Import in javascript, then use import as ref

##### Example

To import `asset.png`:

```js
import Asset from 'static/asset.png';
// Then later
<img src={Asset} />
```

##### Why

This allows Webpack to handle chunking of asset files, which means in the case of files like pngs, it can be converted to a BASE64 string when being imported. Also, it reads nice to have all dependencies/content imported with the same syntax.

## Styles

##### Location

Global/Shared: `src/styles`

Component: `src/components/SomeComponent/SomeComponent.scss`

##### Patterns

* Wrapper class name is `container`
* import base to get access to shared variables in css modules:

```css
@import 'base';
.container {
  @extend .flex-row;
}
```

Some components use the new styles.js pattern - more to come on this once the full switch has happened.