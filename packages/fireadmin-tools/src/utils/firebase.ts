import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { readJsonFile } from './files'
import { DEFAULT_BASE_PATH } from '../constants/filePaths'

function getServiceAccountPath(envName = '') {
  const withPrefix = path.join(
    DEFAULT_BASE_PATH,
    `serviceAccount-${envName}.json`
  )
  if (fs.existsSync(withPrefix)) {
    return withPrefix
  }
  return path.join(DEFAULT_BASE_PATH, 'serviceAccount.json')
}

/**
 * Get environment variable based on the current CI environment
 * @param  {String} varNameRoot - variable name without the environment prefix
 * @return {Any} Value of the environment variable
 * @example
 * envVar('FIREBASE_PROJECT_ID')
 * // => 'fireadmin-stage' (value of 'STAGE_FIREBASE_PROJECT_ID' environment var)
 */
export function envVar(varNameRoot: string): any {
  // CI Environment (environment variables loaded directly)
  return process.env[varNameRoot]
}

/**
 * Get parsed value of environment variable. Useful for environment variables
 * which have characters that need to be escaped.
 * @param  {String} varNameRoot - variable name without the environment prefix
 * @return {Any} Value of the environment variable
 * @example
 * getParsedEnvVar('FIREBASE_PRIVATE_KEY_ID')
 * // => 'fireadmin-stage' (parsed value of 'STAGE_FIREBASE_PRIVATE_KEY_ID' environment var)
 */
function getParsedEnvVar(varNameRoot: string) {
  const val = envVar(varNameRoot)
  if (!val) {
    /* eslint-disable no-console */
    console.error(
      `"${chalk.cyan(
        varNameRoot
      )}" not found, make sure it is set within environment variables.`
    )
    /* eslint-enable no-console */
  }
  try {
    if (typeof val === 'string') {
      return JSON.parse(val)
    }
    return val
  } catch (err) {
    console.error(`Error parsing env var "${varNameRoot}"`) // eslint-disable-line no-console
    return val
  }
}

/* eslint-disable camelcase */
interface ServiceAccount {
  type: string
  project_id: string
  private_key_id: string
  private_key: string
  client_email: string
  client_id: string
  auth_uri: string
  token_uri: string
  auth_provider_x509_cert_url: string
  client_x509_cert_url: string
}
/* eslint-enable camelcase */

/**
 * Get service account from either local file or environment variables
 * @return {Object} Service account object
 */
export async function getServiceAccount(
  envSlug?: string
): Promise<ServiceAccount | any> {
  const serviceAccountPath = getServiceAccountPath(envSlug)

  // Check for local service account file (Local dev)
  if (fs.existsSync(serviceAccountPath)) {
    return readJsonFile(serviceAccountPath) // eslint-disable-line global-require, import/no-dynamic-require
  }
  /* eslint-disable no-console */
  console.log(
    `Service account does not exist at path: "${chalk.cyan(
      serviceAccountPath.replace(`${DEFAULT_BASE_PATH}/`, '')
    )}" falling back to environment variables...`
  )
  /* eslint-enable no-console */

  // Use SERVICE_ACCOUNT environment variable
  const serviceAccountEnvVar = envVar('SERVICE_ACCOUNT')
  if (serviceAccountEnvVar) {
    if (typeof serviceAccountEnvVar === 'string') {
      try {
        return JSON.parse(serviceAccountEnvVar)
      } catch (err) {
        /* eslint-disable */
        console.warn(
          'Issue parsing SERVICE_ACCOUNT environment variable from string to object, returning string'
        )
        /* eslint-enable */
      }
    }
    return serviceAccountEnvVar
  }

  // Fallback to loading from seperate environment variables
  const clientId = envVar('FIREBASE_CLIENT_ID')
  if (clientId) {
    /* eslint-disable */
    console.log(
      '"FIREBASE_CLIENT_ID" will override FIREBASE_TOKEN for auth when calling firebase-tools - this may cause unexepected behavior'
    )
    /* eslint-enable */
  }
  /* eslint-disable camelcase */
  return {
    type: 'service_account',
    project_id: envVar('FIREBASE_PROJECT_ID'),
    private_key_id: envVar('FIREBASE_PRIVATE_KEY_ID'),
    private_key: getParsedEnvVar('FIREBASE_PRIVATE_KEY'),
    client_email: envVar('FIREBASE_CLIENT_EMAIL'),
    client_id: clientId,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://accounts.google.com/o/oauth2/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: envVar('FIREBASE_CERT_URL')
  }
  /* eslint-enable camelcase */
}
