type ActionRunnerInstanceResource = 'rtdb' | 'firestore' | 'storage'

export interface ActionRunnerInstanceSetting {
  path: string
  resource: ActionRunnerInstanceResource
}

interface EnvironmentServiceAccountObj {
  /**
   * Set by copyServiceAccountToFirestore Cloud Function
   */
  credential?: string
  fullPath: string
}

interface ActionRunnerEnvironment {
  serviceAccount: EnvironmentServiceAccountObj
  databaseURL: string
  locked: boolean
  readOnly: boolean
  createdBy: string
  createdAt: FirebaseFirestore.Timestamp
}

export interface ActionRunnerEventData {
  src: ActionRunnerInstanceSetting
  dest: ActionRunnerInstanceSetting
  environments?: ActionRunnerEnvironment[]
  projectId: string
  environmentValues?: any[]
  inputValues: any[]
}

type ActionStepType = 'copy' | 'custom'

export interface ActionStep {
  type: ActionStepType
  disableBatching?: boolean
  src: ActionRunnerInstanceSetting
  dest: ActionRunnerInstanceSetting
  merge?: boolean
  subcollections?: boolean
  required?: boolean
}
