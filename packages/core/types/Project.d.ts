import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';
interface ProjectPermissionValue {
    role?: string;
    updatedAt?: firebase.firestore.FieldValue;
}
interface ProjectRolePermissionsValue {
    name?: string;
    updatedAt?: Record<string, object[]>;
}
interface ProjectRoleValue {
    name?: string;
    permissions?: Record<string, ProjectRolePermissionsValue>;
}
declare type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string;
export declare class ProjectValue {
    snap: firebase.firestore.DocumentSnapshot;
    exists: boolean;
    name?: string;
    createdAt?: firebase.firestore.FieldValue;
    updatedAt?: firebase.firestore.FieldValue;
    permissions?: Record<string, ProjectPermissionValue>;
    roles?: Record<ProjectRoleName, ProjectRoleValue>;
    constructor(projectSnap: firebase.firestore.DocumentSnapshot);
}
export default class Project {
    path: string;
    id: string;
    ref: firebase.firestore.DocumentReference;
    listen: any;
    constructor(projectId: string);
    get(): Promise<ProjectValue>;
    update(values: object): Promise<any>;
    delete(): Promise<void>;
}
export {};
