import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
declare class ProjectPermissionValue {
    constructor(permissionValue: object);
    role?: string;
    updatedAt?: firebase.firestore.FieldValue;
}
declare class ProjectRolePermissionsValue {
    constructor(rolePermissionValue: object);
    name?: string;
    updatedAt?: Record<string, object[]>;
}
declare class ProjectRoleValue {
    constructor(permissionValue: object);
    name?: string;
    permissions?: Record<string, ProjectRolePermissionsValue>;
}
declare type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string;
export declare class ProjectValue {
    constructor(projectSnap: firebase.firestore.DocumentSnapshot);
    snap: firebase.firestore.DocumentSnapshot;
    exists: Boolean;
    name?: string;
    createdAt?: firebase.firestore.FieldValue;
    updatedAt?: firebase.firestore.FieldValue;
    permissions?: Record<string, ProjectPermissionValue>;
    roles?: Record<ProjectRoleName, ProjectRoleValue>;
}
export default class Project {
    constructor(projectId: string);
    path: string;
    id: string;
    ref: firebase.firestore.DocumentReference;
    listen: any;
    get(): Promise<ProjectValue>;
    update(values: Object): Promise<any>;
    delete(): Promise<void>;
    validate(): void;
}
export {};
