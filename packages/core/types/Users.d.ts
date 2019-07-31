import firebase from 'firebase/app';
import User from './User';
import { UserValue } from './types/User';
import { GetOptions } from './utils/firebase';
export default class Users {
    path?: string;
    ref: firebase.firestore.CollectionReference;
    constructor(financialTransactionsData?: object);
    create(newUserData: UserValue): Promise<User>;
    get(options?: GetOptions): Promise<User[] | object[]>;
}
