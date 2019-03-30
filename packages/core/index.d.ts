declare module "constants/firebasePaths" {
    export const USERS_PATH = "users";
    export const PROJECTS_PATH = "projects";
    export const REQUESTS_PATH = "requests";
}
declare module "Project" {
    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    class ProjectPermissionValue {
        constructor(permissionValue: object);
        role?: string;
        updatedAt?: firebase.firestore.FieldValue;
    }
    class ProjectRolePermissionsValue {
        constructor(rolePermissionValue: object);
        name?: string;
        updatedAt?: Record<string, object[]>;
    }
    class ProjectRoleValue {
        constructor(permissionValue: object);
        name?: string;
        permissions?: Record<string, ProjectRolePermissionsValue>;
    }
    type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string;
    export class ProjectValue {
        constructor(projectSnap: firebase.firestore.DocumentSnapshot);
        snap: firebase.firestore.DocumentSnapshot;
        exists: Boolean;
        name?: string;
        createdAt?: firebase.firestore.FieldValue;
        updatedAt?: firebase.firestore.FieldValue;
        permissions?: Record<string, ProjectPermissionValue>;
        roles?: Record<ProjectRoleName, ProjectRoleValue>;
    }
    /**
     * Fireadmin Project
     */
    export default class Project {
        constructor(projectId: string);
        path: string;
        id: string;
        ref: firebase.firestore.DocumentReference;
        listen: any;
        /**
         * Get Fireadmin project value
         */
        get(): Promise<ProjectValue>;
        update(values: Object): Promise<any>;
        delete(): Promise<void>;
        validate(): void;
    }
}
declare module "constants/fbConfigs" {
    export const STAGE_FB_CONFIG: {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
    };
    export const PROD_FB_CONFIG: {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
    };
    export const FB_CONFIG_BY_ENV_NAMES: {
        stage: {
            apiKey: string;
            authDomain: string;
            databaseURL: string;
            projectId: string;
            storageBucket: string;
            messagingSenderId: string;
        };
        prod: {
            apiKey: string;
            authDomain: string;
            databaseURL: string;
            projectId: string;
            storageBucket: string;
            messagingSenderId: string;
        };
    };
}
declare module "utils/firebase" {
    import firebase from 'firebase/app';
    import 'firebase/firestore';
    /**
     * @description Initialize firebase application
     */
    export function init(fbConfig: object): firebase.app.App;
    export function storage(): firebase.storage.Storage;
}
declare module "index" {
    export type EnvironmentName = 'stage' | 'prod';
    /**
     * Initialize Fireadmin library
     * @param envName - Name of the Fireadmin environment
     */
    export function initialize(envName: EnvironmentName): void;
    export default initialize;
}
