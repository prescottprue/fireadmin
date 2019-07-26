/**
 * Value representing a ProjectEnvironment.
 */

export interface ProjectEnvironmentValue {
  createdAt?: number;
  createdBy?: string;
  name?: string;
  databaseURL?: string;
  description?: string;
  projectId?: string;
  serviceAccount?: {
    credential?: string;
    fullPath?: string;
    [k: string]: any;
  };
  [k: string]: any;
}
