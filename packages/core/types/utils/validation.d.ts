import Ajv from 'ajv';
export declare const validator: Ajv.Ajv;
export declare function runValidationForClass<ClassType extends any>(classOrName: ClassType | string, dataToValidate: any): Promise<void>;
