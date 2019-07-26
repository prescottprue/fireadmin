export interface ActionEnvironmentSetting {
    name: string;
    required?: boolean;
}
export interface ActionInputSetting {
    name: string;
    required?: boolean;
}
export declare type ActionStepType = 'copy' | 'custom';
export interface ActionStepSetting {
    name: string;
    type: ActionStepType;
    filePath?: string;
}
export interface WhenSetting {
    beforeMerge?: boolean;
    afterMerge?: boolean;
    notDuringBuisnessHours?: boolean;
}
export interface ActionSettings {
    environments?: ActionEnvironmentSetting[];
    inputs?: ActionInputSetting[];
    steps?: ActionStepSetting[];
    when?: WhenSetting;
    idempotent?: boolean;
}
export interface ActionValue {
    exists?: boolean;
    snap?: firebase.firestore.DocumentSnapshot;
    name?: string;
    createdBy?: string;
    createdAt?: firebase.firestore.FieldValue;
    updatedAt?: firebase.firestore.FieldValue;
}
