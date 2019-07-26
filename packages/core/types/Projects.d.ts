import * as firebase from 'firebase/app';
import 'firebase/firestore';
import User from './User';
import { UserValue } from './types/User';
import { GetOptions } from './utils/firebase';
export default class Projects {
    path?: string;
    ref: firebase.firestore.CollectionReference | firebase.firestore.DocumentReference;
    constructor(financialTransactionsData?: object);
    create(newUserData: UserValue): Promise<User>;
    get(options: GetOptions): Promise<User>;
}
