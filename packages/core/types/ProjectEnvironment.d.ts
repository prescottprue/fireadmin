import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { GetOptions } from './utils/firebase';
import { ProjectEnvironmentValue } from './types/ProjectEnvironment';
export default class ProjectEnvironment {
    path: string;
    id: string;
    ref: firebase.firestore.DocumentReference;
    listen: any;
    updatedAt?: firebase.firestore.FieldValue;
    createdAt?: firebase.firestore.FieldValue;
    constructor(projectId: string, environmentId: string, environmentData?: object);
    validate(environmentData: ProjectEnvironmentValue): Promise<void>;
    get(options?: GetOptions): Promise<ProjectEnvironment>;
    update(projectData: ProjectEnvironmentValue): Promise<any>;
    delete(): Promise<void>;
}
