import { FireadminConfig } from './types/index';
export * from './types/Action';
export default function initialize(fbConfig: FireadminConfig): void;
export declare function loginWithToken(customToken: string): Promise<import("firebase").auth.UserCredential>;
