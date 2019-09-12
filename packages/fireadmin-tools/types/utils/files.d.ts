/// <reference types="node" />
import { readdir, readFile } from 'fs';
export declare const readDirPromise: typeof readdir.__promisify__;
export declare const readFilePromise: typeof readFile.__promisify__;
export declare function readJsonFile(filePath: string): Promise<object | any>;
export declare function requireAsync(modulePath: string): Promise<string | null>;
export declare function getLocalActionsFolder(): string | undefined;
