export declare function to<T, U = Error>(promise: Promise<T>, errorExt?: object): Promise<[U | null, T | undefined]>;
export declare function promiseWaterfall(callbacks: any[]): Promise<any[]>;
