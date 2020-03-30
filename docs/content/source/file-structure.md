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

- Global: `src/components`
- Contained/In one route only: `src/routes/:routeName/components`

##### Creation

As noted in [the adding features](/coding-patterns/adding-features) we use the component subgenerator like so:

```bash
yo react-firebase:component
```

##### Handles

- All view layout/styling

##### Patterns

- Should be stateless \(just a function instead of a Class\)

##### Example

`src/components/SomeComponent.js`:

```js
import React, { PropTypes } from "react";

function SomeComponent({ someProp }) {
  return <div>Some Component</div>;
}

SomeComponent.propTypes = {
  someProp: PropTypes.func.isRequired,
};

export default SomeComponent;
```

#### Approved file names by component

These are the only authorized files, anything that doesn't have a clear home should go in \*enhancer.js. **_(Need to update the generator)_**

| Name                    | Purpose                                                                                              |
| ----------------------- | ---------------------------------------------------------------------------------------------------- |
| `Component.enhancer.js` | Adds data and handling to the Component, importing the following files to do so: (ALSO THE CATCHALL) |
| `Component.js`          | Functional React Component                                                                           |
| `Component.spec.js`     | Unit tests per component                                                                             |
| `Component.styles.js`   | JS Styles / MUI V1 stylesheets                                                                       |
| `index.js`              | Exports the enhanced Component                                                                       |

### Routes

Async vs Sync definitions

##### Location

- Route Folder: `src/routes/SomeRoute`
- Components: `src/routes/SomeRoute/components/SomeComponent/SomeComponent.js`

##### Creation

Create a new container name "SomeRoute" by running `yo react-firebase:route SomeRoute`

##### What they Handle

- Pages/Routes/Locations within app
- They can contain components, and modules

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
import Asset from "static/asset.png";
// Then later
<img src={Asset} />;
```

##### Why

This allows Webpack to handle chunking of asset files, which means in the case of files like pngs, it can be converted to a BASE64 string when being imported. Also, it reads nice to have all dependencies/content imported with the same syntax.

## Styles

##### Location

Global/Shared: `src/theme`

##### Patterns

Styles for components are within `.styles` file within the component folder
