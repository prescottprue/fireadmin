import * as firebase from 'firebase/app';
import { GetOptions } from './utils/firebase';
import { ActionTemplateValue } from './types/ActionTemplate';
export * from './types/ActionRequest';
export default class ActionTemplate {
    path: string;
    id?: string;
    ref: firebase.firestore.DocumentReference;
    listen: any;
    updatedAt?: firebase.firestore.FieldValue;
    createdAt?: firebase.firestore.FieldValue;
    constructor(actionId?: string, actionData?: object);
    validate(actionData: ActionTemplateValue): Promise<void>;
    get(options?: GetOptions): Promise<ActionTemplate>;
    update(actionData: ActionTemplateValue): Promise<any>;
    delete(): Promise<void>;
}
