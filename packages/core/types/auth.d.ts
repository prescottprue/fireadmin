export declare function loginWithApiKey(apiKey: string, uid: string): Promise<import("firebase").User | {
    token: any;
} | {
    additionalUserInfo?: import("firebase").auth.AdditionalUserInfo | null | undefined;
    credential: import("firebase").auth.AuthCredential | null;
    operationType?: string | null | undefined;
    user: import("firebase").User | null;
    token: any;
}>;
