import * as firebase from 'firebase/app';
import { ProjectValue } from './types/Project';
import { GetOptions } from './utils/firebase';
import Project from './Project';
export default class Projects {
    path?: string;
    ref: firebase.firestore.CollectionReference;
    constructor(financialTransactionsData?: object);
    create(newProjectData: ProjectValue): Promise<Project>;
    get(options?: GetOptions): Promise<Project[] | object[]>;
}
