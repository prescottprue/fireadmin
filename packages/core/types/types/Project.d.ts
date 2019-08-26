interface ProjectPermissionValue {
    role?: string;
    updatedAt?: firebase.firestore.FieldValue;
}
interface ProjectRolePermissionsValue {
    name?: string;
    updatedAt?: Record<string, object[]>;
}
interface ProjectRoleValue {
    name?: string;
    permissions?: Record<string, ProjectRolePermissionsValue>;
}
declare type ProjectRoleName = 'editor' | 'owner' | 'viewer' | string;
export interface ProjectValue {
    exists?: boolean;
    snap?: firebase.firestore.DocumentSnapshot;
    name?: string;
    createdBy?: string;
    createdAt?: firebase.firestore.FieldValue;
    updatedAt?: firebase.firestore.FieldValue;
    permissions?: Record<string, ProjectPermissionValue>;
    roles?: Record<ProjectRoleName, ProjectRoleValue>;
}
export {};
