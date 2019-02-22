# Fireadmin Docs

> Fireadmin documentation content and application (markdown converted into static HTML using Gatsby)

## Getting Started

1. Make sure you set node version to at least `8.12.0` (`nvm use 8.12.0`)
1. Install deps: `yarn install`
1. Start dev server: `yarn start`

## Dev Commands

```sh
# lint code
yarn lint

# auto-fix lint and format
yarn lint:fix

# generate static build
yarn build
```

**:warning: Add `--prefix-paths` if you are using path prefix!**

## Changing Docs

All docs content lives in the `content` folder.

### Updating Docs

1. Go into the `content` folder and look for the markdown file associated with the doc (structure is a mirror of what is in UI)
1. Change markdown file and save
1. Run locally using `yarn start` and visiting `localhost:8000` to confirm the looks of your changes
1. Make a PR to this Repo and assign it to another engineer

### Adding A Doc

1. Place a new `.md` file within the `content` folder (make sure to place it in the relevant location)
1. Place config similar at the top of the document (where `slug` is the intended path to the doc):
  
  ```md
  ---
  title: Adding To These Docs
  slug: docs/adding-to-these-docs
  type: page
  language: en
  tags:
    - docs
  ---
  ```
1. Reboot your local dev server if it was already running (`yarn start` again)
1. Confirm that your doc appears in the sidebar (under any parent if provided in slug)

**Note:** If you are making a new folder, make sure to have a `README.md` in the base of the folder with `slug: <- folder ->` like (` slug: docs`) or it will not appear in the sidebar.
