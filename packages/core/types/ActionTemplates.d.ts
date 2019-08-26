import * as firebase from 'firebase/app';
import { ActionTemplateValue } from './types/ActionTemplate';
import { GetOptions } from './utils/firebase';
import ActionTemplate from './ActionTemplate';
export default class ActionTemplates {
    path?: string;
    ref: firebase.firestore.CollectionReference;
    constructor(templateData?: object);
    create(newTemplateData: ActionTemplateValue): Promise<ActionTemplate>;
    get(options?: GetOptions): Promise<ActionTemplate[] | object[]>;
}
