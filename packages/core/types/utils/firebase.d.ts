import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import 'firebase/functions';
import 'firebase/auth';
export declare function initializeFirebase(fbConfig?: any): firebase.app.App;
export declare function getApp(): firebase.app.App;
export declare function storage(): firebase.storage.Storage;
export declare function rtdbRef(refPath: string): firebase.database.Reference;
export declare function firestoreRef(refPath: string): firebase.firestore.CollectionReference | firebase.firestore.DocumentReference;
export interface GetOptions extends firebase.firestore.GetOptions {
    resolveForNotFound?: Boolean;
    json?: Boolean;
}
export declare function throwIfNotFoundInVal(snap: firebase.database.DataSnapshot | firebase.firestore.DocumentSnapshot, opts?: GetOptions, errMsg?: string): any;
export declare function valFromSnap<T>(snap: firebase.firestore.DocumentSnapshot | firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot, classFactory?: (docSnap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot) => T): firebase.firestore.DocumentData | undefined;
export declare function throwIfNotFoundInData(snap: firebase.firestore.DocumentSnapshot | firebase.firestore.QuerySnapshot, opts?: GetOptions, errMsg?: string): any;
export declare function rtdbSnap(ref: firebase.database.Reference | firebase.database.Query | string): Promise<firebase.database.DataSnapshot>;
export declare function rtdbVal(ref: firebase.database.Reference | string): Promise<any>;
export declare function snapToArray(snap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot, filterFunc?: (docSnap: firebase.database.DataSnapshot) => boolean): Array<firebase.database.DataSnapshot>;
export declare function snapToItemsArray<T>(snap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot, classFactory: (docSnap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot) => T): Array<T>;
export declare function loginWithToken(customToken: string): Promise<firebase.auth.UserCredential>;
