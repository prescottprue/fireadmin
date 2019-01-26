---
title: "Example Post"
slug: code-highlighting-post
cover: ./cover.png
date: 2017-01-03
language: en
tags:
    - gatsby
---

## Vue.js


Vue (pronounced /vjuː/, like **view**) is a **progressive framework** for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable. The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with [modern tooling](single-file-components.html) and [supporting libraries](https://github.com/vuejs/awesome-vue#components--libraries).

```html
<template>
  <section class="section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp">
    <div class="mdl-card mdl-cell mdl-cell--12-col">
      <ul class="mdl-list">
        <li
          v-for="content in orderedItems"
          :key="content.sha"
          class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <i
              v-if="content.type === 'file'"
              class="material-icons mdl-list__item-icon">description</i>
            <i
              v-else
              class="material-icons mdl-list__item-icon">folder</i>
            {{ content.name }}
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FileExplorer',
  props: {
    repoContent: {
      // warning, may be an object
      type: Array,
      default: () => []
    }
  },
  computed: {
    orderedItems () {
      const repoContentCopy = [...this.repoContent]
      return repoContentCopy.sort((contentA, contentB) => contentB.type < contentA.type)
    }
  }
}
</script>

<style scoped>
.section--center {
  width: 100%;
  margin-bottom: 48px;
}
.mdl-list {
  padding: 0;
  margin: 0;
}
.mdl-list__item {
  padding: 0px 16px;
}
</style>
```

## JSX

```js
class ShoppingList extends React.Component {
  render() {
    return (
      <div className="shopping-list">
        <h1>Shopping List for {this.props.name}</h1>
        <ul>
          <li>Instagram</li>
          <li>WhatsApp</li>
          <li>Oculus</li>
        </ul>
      </div>
    );
  }
}
```

## TypeScript

```typescript
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```


## SCSS

```scss
@import 'reset';

body {
  font: 100% Helvetica, sans-serif;
  background-color: #efefef;
}

%message-shared {
  border: 1px solid #ccc;
  padding: 10px;
  color: #333;
}

.message {
  @extend %message-shared;
}
```