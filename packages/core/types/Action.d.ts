import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
import { GetOptions } from './utils/firebase';
import { ActionValue } from './types/Action';
export * from './types/Action';
export default class Action implements ActionValue {
    path: string;
    id: string;
    ref: firebase.firestore.DocumentReference;
    listen: any;
    updatedAt?: firebase.firestore.FieldValue;
    createdAt?: firebase.firestore.FieldValue;
    constructor(actionId: string, actionData?: object);
    validate(actionData: ActionValue): void;
    get(options?: GetOptions): Promise<Action>;
    update(actionData: ActionValue): Promise<any>;
    delete(): Promise<void>;
}
