import { ActionSettings } from './Action';
export interface ActionTemplateValue extends ActionSettings {
    createdAt?: firebase.firestore.FieldValue;
    createdBy?: string;
    name?: string;
    public?: boolean;
    subcollections?: boolean;
}
