export interface ActionEnvironmentSetting {
    name: string;
    required?: boolean;
}
export interface ActionInputSetting {
    name: string;
    required?: boolean;
}
export declare type CustomActionStepType = 'custom';
export declare type ActionStepType = 'copy' | CustomActionStepType;
export interface CustomActionStepSetting {
    name?: string;
    description?: string;
    type: CustomActionStepType;
    content: string;
    filePath: string;
}
export interface GenericActionStepSetting {
    name?: string;
    description?: string;
    type: ActionStepType;
    src?: any;
    dest?: any;
}
export declare type ActionStepSetting = GenericActionStepSetting | CustomActionStepSetting;
export interface WhenSetting {
    beforeMerge?: boolean;
    afterMerge?: boolean;
    notDuringBuisnessHours?: boolean;
}
export interface ActionSettings {
    projectId?: string;
    environments: ActionEnvironmentSetting[];
    inputs: ActionInputSetting[];
    steps: ActionStepSetting[];
    when?: WhenSetting;
    idempotent?: boolean;
}
