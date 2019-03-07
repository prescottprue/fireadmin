export const STORAGE_AND_PLATFORM_SCOPES = [
  'https://www.googleapis.com/auth/devstorage.full_control',
  'https://www.googleapis.com/auth/cloud-platform'
]

export const SERVICE_ACCOUNT_PARAMS = [
  'type',
  'project_id',
  'private_key_id',
  'private_key',
  'client_email',
  'client_id',
  'auth_uri',
  'token_uri'
]

export const MISSING_CRED_ERROR_MSG =
  'Credential parameter is required to load service account from Firestore'
