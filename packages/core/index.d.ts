/// <reference types="inquirer" />
declare module "utils/validation" {
    import Ajv from 'ajv';
    export const validator: Ajv.Ajv;
    export function runValidationForClass<ClassType extends any>(_class: ClassType, dataToValidate: object): Promise<void>;
}
declare module "constants/firebasePaths" {
    export const DISPLAY_NAMES_PATH = "displayNames";
    export const USERS_PATH = "users";
    export const SESSIONS_PATH = "sessions";
    export const PROJECTS_PATH = "projects";
    export const SEARCH_PATH = "search";
    export const SERVICE_ACCOUNTS_PATH = "serviceAccounts";
    export const PRESENCE_PATH = "presence";
    export const VERSION_INFO_PATH = "versionInfo";
    export const ACTION_RUNNER_EVENT_PATH = "actionRunner";
    export const CUSTOM_STEPS_PATH = "actionTemplates/customSteps";
    export const ACTION_RUNNER_REQUESTS_PATH: string;
    export const ACTION_RUNNER_RESPONSES_PATH: string;
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
    import 'firebase/database';
    import 'firebase/functions';
    import 'firebase/auth';
    export function initializeFirebase(fbConfig?: any): firebase.app.App;
    export function getApp(): firebase.app.App;
    export function storage(): firebase.storage.Storage;
    export function rtdbRef(refPath: string): firebase.database.Reference;
    export function firestoreRef(refPath: string): firebase.firestore.CollectionReference | firebase.firestore.DocumentReference;
    export interface GetOptions extends firebase.firestore.GetOptions {
        resolveForNotFound?: Boolean;
        json?: Boolean;
    }
    export function throwIfNotFoundInVal(snap: firebase.database.DataSnapshot | firebase.firestore.DocumentSnapshot, opts?: GetOptions, errMsg?: string): any;
    export function valFromSnap<T>(snap: firebase.firestore.DocumentSnapshot | firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot, classFactory?: (docSnap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot) => T): firebase.firestore.DocumentData | undefined;
    export function throwIfNotFoundInData(snap: firebase.firestore.DocumentSnapshot | firebase.firestore.QuerySnapshot, opts?: GetOptions, errMsg?: string): any;
    export function rtdbSnap(ref: firebase.database.Reference | firebase.database.Query | string): Promise<firebase.database.DataSnapshot>;
    export function rtdbVal(ref: firebase.database.Reference | string): Promise<any>;
    export function snapToArray(snap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot, filterFunc?: (docSnap: firebase.database.DataSnapshot) => boolean): Array<firebase.database.DataSnapshot>;
    export function snapToItemsArray<T>(snap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot | firebase.firestore.DocumentSnapshot, classFactory: (docSnap: firebase.database.DataSnapshot | firebase.firestore.QuerySnapshot) => T): Array<T>;
    export function loginWithToken(customToken: string): Promise<firebase.auth.UserCredential>;
}
declare module "types/Action" {
    export interface ActionEnvironmentSetting {
        name: string;
        required?: boolean;
    }
    export interface ActionInputSetting {
        name: string;
        required?: boolean;
    }
    export type CustomActionStepType = 'custom';
    export type ActionStepType = 'copy' | CustomActionStepType;
    export interface CustomActionStepSetting {
        name?: string;
        description?: string;
        type: CustomActionStepType;
        content: string;
        filePath: string;
    }
    export interface GenericActionStepSetting {
        name?: string;
        description?: string;
        type: ActionStepType;
        src?: any;
        dest?: any;
    }
    export type ActionStepSetting = GenericActionStepSetting | CustomActionStepSetting;
    export interface WhenSetting {
        beforeMerge?: boolean;
        afterMerge?: boolean;
        notDuringBuisnessHours?: boolean;
    }
    export interface ActionSettings {
        environments: ActionEnvironmentSetting[];
        inputs: ActionInputSetting[];
        steps: ActionStepSetting[];
        when?: WhenSetting;
        idempotent?: boolean;
    }
}
declare module "types/ActionTemplate" {
    import { ActionSettings } from "types/Action";
    export interface ActionTemplateValue extends ActionSettings {
        createdAt?: firebase.firestore.FieldValue;
        createdBy?: string;
        name?: string;
        public?: boolean;
        subcollections?: boolean;
    }
}
declare module "types/ActionRequest" {
    import { ActionSettings } from "types/Action";
    import { ActionTemplateValue } from "types/ActionTemplate";
    export interface ActionRequestValue extends ActionSettings {
        exists?: boolean;
        snap?: firebase.firestore.DocumentSnapshot;
        name?: string;
        description?: string;
        createdBy?: string;
        templateId?: string;
        template?: ActionTemplateValue;
        inputValues?: string[];
        environmentValues?: string[];
        createdAt?: firebase.firestore.FieldValue;
        updatedAt?: firebase.firestore.FieldValue;
    }
}
declare module "connectors/RTDBItem" {
    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import 'firebase/database';
    export default class RTDBItem {
        path: string | undefined;
        listen: Function;
        constructor(path: string | undefined);
        readonly ref: firebase.database.Reference;
        get(): Promise<any>;
        getSnapshot(): Promise<firebase.database.DataSnapshot>;
        set(values: Object, onComplete?: (a: Error | null) => any): Promise<any>;
        update(values: Object, onComplete?: (a: Error | null) => any): Promise<any>;
        delete(): Promise<any>;
    }
}
declare module "ActionRequest" {
    import { GetOptions } from "utils/firebase";
    import { ActionRequestValue } from "types/ActionRequest";
    import { ActionInputSetting, ActionStepSetting, ActionEnvironmentSetting } from "types/Action";
    import RTDBItem from "connectors/RTDBItem";
    export default class ActionRequest extends RTDBItem {
        id?: string;
        environments?: ActionEnvironmentSetting[];
        inputs?: ActionInputSetting[];
        steps?: ActionStepSetting[];
        constructor(actionId?: string, actionData?: Partial<ActionRequestValue>);
        validate(actionData: ActionRequestValue): void;
        create(newActionData: ActionRequestValue): Promise<ActionRequest>;
        get(options?: GetOptions): Promise<ActionRequest>;
        update(actionData: ActionRequestValue): Promise<ActionRequest>;
    }
}
declare module "ActionRequests" {
    import * as firebase from 'firebase/app';
    import { ActionRequestValue } from "types/ActionRequest";
    import { GetOptions } from "utils/firebase";
    import ActionRequest from "ActionRequest";
    export default class ActionRequests {
        path?: string;
        ref: firebase.database.Reference;
        constructor(templateData?: object);
        create(newActionRequest: ActionRequestValue): Promise<ActionRequest>;
        get(options?: GetOptions): Promise<ActionRequest[] | object[]>;
    }
}
declare module "constants/firestorePaths" {
    export const ACTION_TEMPLATES_COLLECTION = "actionTemplates";
    export const USERS_COLLECTION = "users";
    export const PROJECTS_COLLECTION = "projects";
    export const PROJECTS_ENVIRONMENTS_COLLECTION = "environments";
    export const SYSTEM_SETTINGS_COLLECTION = "system_settings";
    export const USER_API_KEYS_SUBCOLLECTION = "api_keys";
}
declare module "ActionTemplate" {
    import * as firebase from 'firebase/app';
    import { GetOptions } from "utils/firebase";
    import { ActionTemplateValue } from "types/ActionTemplate";
    export * from "types/ActionRequest";
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
}
declare module "ActionTemplates" {
    import * as firebase from 'firebase/app';
    import { ActionTemplateValue } from "types/ActionTemplate";
    import { GetOptions } from "utils/firebase";
    import ActionTemplate from "ActionTemplate";
    export default class ActionTemplates {
        path?: string;
        ref: firebase.firestore.CollectionReference;
        constructor(templateData?: object);
        create(newTemplateData: ActionTemplateValue): Promise<ActionTemplate>;
        get(options?: GetOptions): Promise<ActionTemplate[] | object[]>;
    }
}
declare module "DisplayName" {
    import RTDBItem from "connectors/RTDBItem";
    import { GetOptions } from "utils/firebase";
    export default class DisplayName extends RTDBItem {
        id: string;
        path: string;
        constructor(id: string, displayNameData?: object);
        validate(displayNameData: string): void;
        update(displayNameData: string): Promise<any>;
        get(options?: GetOptions): Promise<DisplayName>;
    }
}
declare module "DisplayNames" {
    import RTDBItem from "connectors/RTDBItem";
    export default class DisplayNames extends RTDBItem {
        constructor();
        path: string;
    }
}
declare module "types/Project" {
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
    type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string;
    export interface ProjectValue {
        exists?: boolean;
        snap?: firebase.firestore.DocumentSnapshot;
        name?: string;
        createdBy?: string;
        createdAt?: firebase.firestore.FieldValue;
        updatedAt?: firebase.firestore.FieldValue;
        permissions?: Record<string, ProjectPermissionValue>;
        roles?: Record<ProjectRoleName, ProjectRoleValue>;
    }
}
declare module "types/ProjectEnvironment" {
    export interface ProjectEnvironmentValue {
        createdAt?: number;
        createdBy?: string;
        name?: string;
        databaseURL?: string;
        description?: string;
        projectId?: string;
        serviceAccount?: {
            credential?: string;
            fullPath?: string;
            [k: string]: any;
        };
        [k: string]: any;
    }
}
declare module "ProjectEnvironment" {
    import * as firebase from 'firebase/app';
    import 'firebase/firestore';
    import { GetOptions } from "utils/firebase";
    import { ProjectEnvironmentValue } from "types/ProjectEnvironment";
    export default class ProjectEnvironment {
        path: string;
        id: string;
        ref: firebase.firestore.DocumentReference;
        listen: any;
        updatedAt?: firebase.firestore.FieldValue;
        createdAt?: firebase.firestore.FieldValue;
        constructor(projectId: string, environmentId: string, environmentData?: object);
        validate(environmentData: ProjectEnvironmentValue): void;
        get(options?: GetOptions): Promise<ProjectEnvironment>;
        update(projectData: ProjectEnvironmentValue): Promise<any>;
        delete(): Promise<void>;
    }
}
declare module "Project" {
    import * as firebase from 'firebase/app';
    import { GetOptions } from "utils/firebase";
    import { ProjectValue } from "types/Project";
    import ProjectEnvironment from "ProjectEnvironment";
    export default class Project implements ProjectValue {
        path: string;
        id: string;
        ref: firebase.firestore.DocumentReference;
        listen: any;
        name?: string;
        updatedAt?: firebase.firestore.FieldValue;
        createdAt?: firebase.firestore.FieldValue;
        constructor(projectId: string, projectData?: ProjectValue);
        validate(projectData: ProjectValue): void;
        get(options?: GetOptions): Promise<Project>;
        getEnvironments(options?: GetOptions): Promise<ProjectEnvironment[]>;
        update(projectData: ProjectValue): Promise<any>;
        delete(): Promise<void>;
    }
}
declare module "Projects" {
    import { ProjectValue } from "types/Project";
    import { GetOptions } from "utils/firebase";
    import Project from "Project";
    export default class Projects {
        path?: string;
        ref: firebase.firestore.CollectionReference;
        constructor(financialTransactionsData?: object);
        create(newProjectData: ProjectValue): Promise<Project>;
        get(options?: GetOptions): Promise<Project[] | object[]>;
    }
}
declare module "types/User" {
    export interface UserValue {
        avatarUrl?: string;
        displayName?: string;
        email?: string;
        providerData?: {
            displayName?: string;
            email?: string;
            photoURL?: string;
            providerId?: string;
            uid?: string;
            [k: string]: any;
        }[];
        [k: string]: any;
    }
}
declare module "User" {
    import * as firebase from 'firebase/app';
    import { GetOptions } from "utils/firebase";
    import { UserValue } from "types/User";
    export default class User implements UserValue {
        path: string;
        id: string;
        ref: firebase.firestore.DocumentReference;
        listen: any;
        updatedAt?: firebase.firestore.FieldValue;
        createdAt?: firebase.firestore.FieldValue;
        constructor(uid: string, userData?: object);
        validate(projectData: UserValue): void;
        get(options?: GetOptions): Promise<User>;
        update(projectData: UserValue): Promise<any>;
        delete(): Promise<void>;
        generateApiKey(): Promise<void>;
    }
}
declare module "Users" {
    import * as firebase from 'firebase/app';
    import User from "User";
    import { UserValue } from "types/User";
    import { GetOptions } from "utils/firebase";
    export default class Users {
        path?: string;
        ref: firebase.firestore.CollectionReference;
        constructor(financialTransactionsData?: object);
        create(newUserData: UserValue): Promise<User>;
        get(options?: GetOptions): Promise<User[] | object[]>;
    }
}
declare module "utils/async" {
    export function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U | null, T | undefined]>;
    export function promiseWaterfall(callbacks: any[]): Promise<any[]>;
}
declare module "auth" {
    export function loginWithApiKey(apiKey: string, uid: string): Promise<import("firebase").User | {
        token: any;
    } | {
        additionalUserInfo?: import("firebase").auth.AdditionalUserInfo | null | undefined;
        credential: import("firebase").auth.AuthCredential | null;
        operationType?: string | null | undefined;
        user: import("firebase").User | null;
        token: any;
    }>;
}
declare module "types/index" {
    export * from "types/ActionRequest";
    export * from "types/Project";
    export * from "types/User";
    export interface FirebaseConfig {
        apiKey: string;
        authDomain: string;
        databaseURL: string;
        projectId: string;
        storageBucket: string;
        messagingSenderId: string;
    }
    export interface FireadminConfig {
        auth?: any;
        credential?: any;
        fireadminApp?: firebase.app.App | any;
    }
}
declare module "index" {
    import { FireadminConfig } from "types/index";
    import { loginWithApiKey } from "auth";
    import Project from "Project";
    import Projects from "Projects";
    import ActionRequest from "ActionRequest";
    import ActionTemplates from "ActionTemplates";
    import ActionTemplate from "ActionTemplate";
    import Users from "Users";
    import User from "User";
    import { ActionEnvironmentSetting, ActionSettings, ActionInputSetting, CustomActionStepSetting } from "types/Action";
    export function initialize(fireadminConfig: FireadminConfig): void;
    export { Projects, Project, Users, User, ActionTemplates, ActionTemplate, ActionRequest, loginWithApiKey, ActionEnvironmentSetting, ActionSettings, ActionInputSetting, CustomActionStepSetting };
    export default initialize;
}
declare module "utils/prompt" {
    import * as inquirer from 'inquirer';
    export type Question = inquirer.Question;
    export function prompt(options: {
        [key: string]: any;
    }, questions: Question[]): Promise<any>;
    export function promptOnce(question: Question): Promise<any>;
}
