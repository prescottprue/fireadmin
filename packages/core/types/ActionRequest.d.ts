import * as firebase from 'firebase/app';
import { GetOptions } from './utils/firebase';
import { ActionRequestValue } from './types/ActionRequest';
import RTDBItem from './connectors/RTDBItem';
export default class ActionRequest extends RTDBItem implements ActionRequestValue {
    id: string;
    updatedAt?: firebase.firestore.FieldValue;
    createdAt?: firebase.firestore.FieldValue;
    constructor(actionId: string, actionData?: object);
    validate(actionData: ActionRequestValue): void;
    get(options?: GetOptions): Promise<ActionRequest>;
    update(actionData: ActionRequestValue): Promise<any>;
}
