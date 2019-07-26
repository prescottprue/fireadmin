import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
export default class RTDBItem {
    path: string | undefined;
    constructor(path: string | undefined);
    readonly ref: firebase.database.Reference;
    get(): Promise<any>;
    getSnapshot(): Promise<firebase.database.DataSnapshot>;
    listen(eventType: "value" | "child_added" | "child_changed" | "child_moved" | "child_removed" | undefined, callback: (a: firebase.database.DataSnapshot | null, b: string | null | undefined) => any): (a: firebase.database.DataSnapshot | null, b: string | null | undefined) => any;
    set(values: Object, onComplete?: (a: Error | null) => any): Promise<any>;
    update(values: Object, onComplete?: (a: Error | null) => any): Promise<any>;
    remove(): Promise<any>;
}
