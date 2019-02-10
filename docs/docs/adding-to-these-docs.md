---
title: Adding To These Docs
slug: docs/adding-to-these-docs
type: page
language: en
tags:
  - docs
---

All docs content lives in the `content` folder as markdown files. When building these are converted into static html which is then uploaded to Firebase Hosting.

### Updating Docs

1. Make a branch for your changes
1. Go into the `content` folder and look for the markdown file associated with the doc (structure is a mirror of what is in UI)
1. Change markdown file(s) and save
1. Run locally using `yarn start` and visiting `localhost:8000` to confirm the looks of your changes
1. Make a PR to this Repo and assign it to another engineer
1. When things are merged to master it will be published to [the stage docs site](https://fireadmin-stage-docs.firebaseapp.com)
1. After hitting "Play" in Gitlab, the changes will be deployed to [the docs site](https://fireadmin.io/docs)

### Adding A Doc

1. Make a branch for your changes
1. Place a new `.md` file within the `content` folder (make sure to place it in the relevant location)
1. Place config similar at the top of the document (where `slug` is the intended path to the doc):
  
    ```md
    ---
    title: Adding To These Docs
    slug: docs/adding-to-these-docs
    type: page
    language: en
    tags:
      - features
    ---
    ```
1. Reboot your local dev server if it was already running (`ctrl + c` then `yarn start` again)
1. Confirm that your doc appears in the sidebar (under any parent if provided in slug)

**Note:** If you are making a new folder, make sure to have a `README.md` in the base of the folder with `slug: <- folder ->` like (` slug: docs`) or it will not appear in the sidebar.

### Adding An Image

Place your image within the `static/images` folder in the root of the repo. These are part of git tracking and they will be automatically copied so that they are available to your markdown. An image stored in `static/images/MyImage.png` can be referenced like so:

```md
![Alt Words](/images/MyImage.png)
```