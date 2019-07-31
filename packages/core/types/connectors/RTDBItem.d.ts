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
