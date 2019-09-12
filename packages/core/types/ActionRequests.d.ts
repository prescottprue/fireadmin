import * as firebase from 'firebase/app';
import { ActionRequestValue } from './types/ActionRequest';
import { GetOptions } from './utils/firebase';
import ActionRequest from './ActionRequest';
export default class ActionRequests {
    path?: string;
    ref: firebase.database.Reference;
    constructor(templateData?: object);
    create(newActionRequest: ActionRequestValue): Promise<ActionRequest>;
    get(options?: GetOptions): Promise<ActionRequest[] | object[]>;
}
