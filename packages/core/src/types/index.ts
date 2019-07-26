export * from './Action'
export * from './Project'
export * from './User'

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

export interface FireadminConfig {
  auth?: any;
  credential?: any;
  fireadminApp?: firebase.app.App;
}
