import * as admin from 'firebase-admin';
import { initialize } from '@fireadmin/core'
import chalk from 'chalk'
import fs from 'fs'
import path from 'path'
import { readJsonFile } from './files'
import { DEFAULT_BASE_PATH } from '../constants/filePaths'


function getServiceAccountPath(envName = '') {
  const withPrefix = path.join(
    DEFAULT_BASE_PATH,
    `serviceAccount-${envName}.json`,
  );
  if (fs.existsSync(withPrefix)) {
    return withPrefix;
  }
  return path.join(DEFAULT_BASE_PATH, 'serviceAccount.json');
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
  return process.env[varNameRoot];
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
  const val = envVar(varNameRoot);
  if (!val) {
    console.error(
      `"${chalk.cyan(
        varNameRoot,
      )}" not found, make sure it is set within environment variables.`,
    );
  }
  try {
    if (typeof val === 'string') {
      return JSON.parse(val);
    }
    return val;
  } catch (err) {
    console.error(`Error parsing env var "${varNameRoot}"`);
    return val;
  }
}

/**
 * Get service account from either local file or environment variables
 * @return {Object} Service account object
 */
export async function getServiceAccount(envSlug?: string): Promise<object> {
  const serviceAccountPath = getServiceAccountPath(envSlug);
  // Check for local service account file (Local dev)
  if (fs.existsSync(serviceAccountPath)) {
    return readJsonFile(serviceAccountPath); // eslint-disable-line global-require, import/no-dynamic-require
  }
  console.log(
    `Service account does not exist at path: "${chalk.cyan(
      serviceAccountPath.replace(`${DEFAULT_BASE_PATH}/`, ''),
    )}" falling back to environment variables...`,
  );
  // Use environment variables (CI)
  const serviceAccountEnvVar = envVar('SERVICE_ACCOUNT');
  if (serviceAccountEnvVar) {
    if (typeof serviceAccountEnvVar === 'string') {
      try {
        return JSON.parse(serviceAccountEnvVar);
      } catch (err) {
        console.warn(
          'Issue parsing SERVICE_ACCOUNT environment variable from string to object, returning string',
        );
      }
    }
    return serviceAccountEnvVar;
  }
  const clientId = envVar('FIREBASE_CLIENT_ID');
  if (clientId) {
    console.log(
      '"FIREBASE_CLIENT_ID" will override FIREBASE_TOKEN for auth when calling firebase-tools - this may cause unexepected behavior',
    );
  }
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
    client_x509_cert_url: envVar('FIREBASE_CERT_URL'),
  };
}

export async function login() {
  // TODO: Instruct user to generate token within UI of Fireadmin and enter it
  // TODO: Save token within file specific to
  // TODO: In the future look into calling endpoint to auth with google - check firebase-tools for reference
  // const fireadminApp = firebase.initializeApp({
  //   credential: admin.credential.refreshToken(refreshToken),
  //   databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
  // })
  const serviceAccount = await getServiceAccount()
  const fireadminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://fireadmin-stage.firebaseio.com'
  })
  initialize({
    fireadminApp
  })
}