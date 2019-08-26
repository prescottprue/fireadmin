import Ajv from 'ajv';
export declare const validator: Ajv.Ajv;
export declare function runValidationForClass<ClassType extends any>(_class: ClassType, dataToValidate: object): Promise<void>;
