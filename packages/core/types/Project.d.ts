import * as firebase from 'firebase/app';
import { GetOptions } from './utils/firebase';
import { ProjectValue } from './types/Project';
import ProjectEnvironment from './ProjectEnvironment';
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
