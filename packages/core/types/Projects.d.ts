import * as firebase from 'firebase/app';
import User from './User';
import { UserValue } from './types/User';
import Project from './Project';
export default class Projects {
    path?: string;
    ref: firebase.firestore.CollectionReference | firebase.firestore.DocumentReference;
    constructor(financialTransactionsData?: object);
    create(newUserData: UserValue): Promise<User>;
    get(options?: firebase.firestore.GetOptions): Promise<Project[]>;
}
