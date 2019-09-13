export interface ActionEnvironmentSetting {
  name: string
  required?: boolean
}

export interface ActionInputSetting {
  name: string
  required?: boolean
}

export type CustomActionStepType = 'custom'
export type ActionStepType = 'copy' | CustomActionStepType

export interface CustomActionStepSetting {
  name?: string
  description?: string
  type: CustomActionStepType
  content: string
  filePath: string
}

export interface GenericActionStepSetting {
  name?: string
  description?: string
  type: ActionStepType
  src?: any
  dest?: any
}

export type ActionStepSetting = GenericActionStepSetting | CustomActionStepSetting

export interface WhenSetting {
  beforeMerge?: boolean
  afterMerge?: boolean
  notDuringBuisnessHours?: boolean
}

/**
 * Settings for a Fireadmin Action Run
 */
export interface ActionSettings {
  projectId?: string
  environments: ActionEnvironmentSetting[]
  inputs: ActionInputSetting[]
  steps: ActionStepSetting[]
  when?: WhenSetting
  idempotent?: boolean
}
