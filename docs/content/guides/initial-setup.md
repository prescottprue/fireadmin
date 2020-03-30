---
title: Initial Setup
slug: guides/initial-setup
type: page
language: en
order: 1
tags:
  - guides
  - getting-started
  - environments
  - projects
  - actions
---

A project created on Fireadmin can contain multiples environments which represent multiple versions of your project. The environment names usually correspond with the state of the application within that environment (i.e. prod for a production environment and stage for a staging environment). In this case each environment is associated with a separate Firebase project.

## Before Starting

1. Make sure you have multiple projects created on Firebase to represent your multiple environment. We will be running an action to move data between them.
1. Get a service a service account for each Firebase project you will be adding to Fireadmin. To get a service account navigate to the Service Accounts tab in the Firebase Console “project settings” page. Then click Generate New Private Key at the bottom of the Service Accounts tab. Your service account will be downloaded as a JSON file — rename the downloaded files in a way that makes it easy to tell a difference (i.e. service-account-prod.json).

## Creating a Project

1. Create a project by clicking the add tile — we will use the name firething (Note: remember that projects on Fireadmin usually contain multiple Firebase projects)

![image](https://cdn-images-1.medium.com/max/1000/1*36v3pDNR07JQkBDffGMAcg.gif)

## Adding Environments

1. Go to Environments page by clicking Go To Environments or by clicking Environments in the project sidebar
1. Begin adding a new environment by clicking Add Environment
1. You can name the first environment whatever you want, but I usually go with Production or Prod
1. Fill in the databaseURL of your project (from the Firebase console)
1. Feel free to add a description of the environment (not necessary)
1. Upload the service account JSON file associated with that environment
1. Click Create
1. Repeat steps 4–7 again for another environment (I usually name the second one Staging).

![image](https://cdn-images-1.medium.com/max/1000/1*abIK5N_ZDwtaC-rlXP3ZUw.gif)

## Running An Action

Now that we have environments setup, they are ready to be used in Actions (common logic such as copying/moving data). Lets start by searching through the existing action templates.

1. Go to the Project Actions page by clicking Actions in the Sidebar
1. Start searching for the action template named Copy Database Collection
1. Click on the name — this loads the the action template (named Copy RTDB Collection) into the Action Runner
1. Select the Source Environment (where data is being copied from)
1. Select the Destination Environment (where data is being copied to)
1. Input a path to copy
1. Click Run Action

![Running An Action](https://cdn-images-1.medium.com/max/1000/1*N62nuM6LJP-7xTV2oP0F_Q.gif)

For information on how to create your own action template, checkout the [custom action template guide](/guides/custom-action-templates)
