import * as firebase from 'firebase/app';
import { GetOptions } from './utils/firebase';
import { UserValue } from './types/User';
export default class User implements UserValue {
    path: string;
    id: string;
    ref: firebase.firestore.DocumentReference;
    listen: any;
    updatedAt?: firebase.firestore.FieldValue;
    createdAt?: firebase.firestore.FieldValue;
    constructor(uid: string, userData?: object);
    validate(projectData: UserValue): void;
    get(options?: GetOptions): Promise<User>;
    update(projectData: UserValue): Promise<any>;
    delete(): Promise<void>;
    generateApiKey(): Promise<void>;
}
