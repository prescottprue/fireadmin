# Fireadmin Functions

## Function Docs

### actionRunner
Runs actions. Supports `backups` and `steps` parameters which can write to multiple resources including Cloud Storage, Firestore, and Real Time Database

### callGoogleApi
Call a Google API authenticated with a service account. Currently used to set Bucket CORS from the project bucket config page.

### copyServiceAccountToFirestore
Copy Service Account JSON files from Cloud Storage to Firestore

### indexActionTemplates
Index public action templates within Algolia for autocomplete searching

### indexUsers
Index public user data within Algolia for autocomplete searching

### sendInvite
Send an invite email to users

### storageFileToRTDB
Convert a file from cloud storage into JSON that is then stored within Firebase Real Time Database


## FAQ
* Why are the babel transforms within `dependencies` instead of `devDependencies`?
    They are used to transform custom code provided as input to action steps. This allows for the template builder to write custom code that uses features like `import` and `async/await`.
