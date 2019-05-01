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