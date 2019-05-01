interface UserMessagingSettings {
  updatedAt?: firebase.firestore.FieldValue
  mostRecentToken?: string
}

export interface UserType {
  snap: firebase.firestore.DocumentSnapshot
  displayName?: string
  email?: string
  avatarUrl?: string
  providerData?: firebase.UserInfo
  messaging?: UserMessagingSettings
}