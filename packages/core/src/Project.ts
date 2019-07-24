import * as firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/firestore'
import { PROJECTS_COLLECTION } from './constants/firestorePaths'

interface ProjectPermissionValue {
  role?: string
  updatedAt?: firebase.firestore.FieldValue
}

// tslint:disable-next-line
interface ProjectRolePermissionsValue {
  name?: string
  updatedAt?: Record<string, object[]>
}

// tslint:disable-next-line
interface ProjectRoleValue {
  name?: string
  permissions?: Record<string, ProjectRolePermissionsValue>
}

type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string

// tslint:disable-next-line
export class ProjectValue {
  public snap: firebase.firestore.DocumentSnapshot
  public exists: boolean
  public name?: string
  public createdAt?: firebase.firestore.FieldValue
  public updatedAt?: firebase.firestore.FieldValue
  public permissions?: Record<string, ProjectPermissionValue>
  public roles?: Record<ProjectRoleName, ProjectRoleValue>
  constructor(projectSnap: firebase.firestore.DocumentSnapshot) {
    this.snap = projectSnap
    this.exists = projectSnap.exists
    Object.assign(this, projectSnap.data())
  }
}

/**
 * Fireadmin Project
 */
// tslint:disable-next-line
export default class Project {
  public path: string
  public id: string
  public ref: firebase.firestore.DocumentReference
  public listen: any
  constructor(projectId: string) {
    this.id = projectId
    this.path = `${PROJECTS_COLLECTION}/${projectId}`
    this.ref = firebase.firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
  }

  /**
   * Get Fireadmin project value
   */
  public get(): Promise<ProjectValue> {
    return this.ref.get().then(docSnap => {
      return new ProjectValue(docSnap)
    })
  }

  public update(values: object): Promise<any> {
    return this.ref.update(values)
  }

  public delete() {
    return this.ref.delete()
  }
}
