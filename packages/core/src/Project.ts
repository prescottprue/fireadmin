import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/database';
import { PROJECTS_PATH } from './constants/firebasePaths';

class ProjectPermissionValue {
  constructor(permissionValue: object) {
    Object.assign(this, permissionValue)
  }
  role?: string
  updatedAt?: firebase.firestore.FieldValue
}

class ProjectRolePermissionsValue {
  constructor(rolePermissionValue: object) {
    Object.assign(this, rolePermissionValue)
  }
  name?: string
  updatedAt?: Record<string, object[]>
}

class ProjectRoleValue {
  constructor(permissionValue: object) {
    Object.assign(this, permissionValue)
  }
  name?: string
  permissions?: Record<string, ProjectRolePermissionsValue>
}

type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string

export class ProjectValue {
  constructor(projectSnap: firebase.firestore.DocumentSnapshot) {
    this.snap = projectSnap
    this.exists = projectSnap.exists
    Object.assign(this, projectSnap.data())
  }
  snap: firebase.firestore.DocumentSnapshot
  exists: Boolean
  name?: string
  createdAt?: firebase.firestore.FieldValue
  updatedAt?: firebase.firestore.FieldValue
  permissions?: Record<string, ProjectPermissionValue>
  roles?: Record<ProjectRoleName, ProjectRoleValue>
}

/**
 * Fireadmin Project
 */
export default class Project {
  constructor(projectId: string) {
    this.id = projectId
    this.path = `${PROJECTS_PATH}/${projectId}`
    this.ref = firebase.firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
  }
  path: string
  id: string
  ref: firebase.firestore.DocumentReference
  listen: any

  /**
   * Get Fireadmin project value
   */
  get(): Promise<ProjectValue> {
    return this.ref.get().then((docSnap) => {
      return new ProjectValue(docSnap)
    })
  }

  update(values: Object): Promise<any> {
    return this.ref.update(values)
  }

  delete() {
    return this.ref.delete()
  }

  validate() {

  }
}