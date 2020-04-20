import crypto from 'crypto'
import { isString } from 'lodash'
import * as functions from 'firebase-functions'

/**
 * Encrypt a string using a password. encryption.password from
 * functions config is used by default if not passed.
 * @param {String} text - Text string to encrypt
 * @param {Object} [options={}]
 * @param {Object} [options.algorithm='aes-256-ctr']
 * @param {Object} options.password - Password to use while
 * encrypting. encryption.password from functions config is used
 * by default if not passed.
 */
export function encrypt(text, options = {}) {
  const { algorithm = 'aes-256-ctr', password: passwordOption } = options
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const password = passwordOption || functions.config().encryption.password
  if (!password) {
    throw new Error(
      'Password is required to encrypt. Check functions config for encryption.password'
    )
  }
  const cipher = crypto.createCipher(algorithm, password) // eslint-disable-line node/no-deprecated-api
  let crypted = cipher.update(str, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

/**
 * Decrypt a string using a password. encryption.password from
 * functions config is used by default if not passed.
 * @param {String} text - Text string to decrypt
 * @param {Object} [options={}]
 * @param {Object} [options.algorithm='aes-256-ctr']
 * @param {Object} options.password - Password to use while
 * decrypting. encryption.password from functions config is used
 * by default if not passed.
 */
export function decrypt(text, options = {}) {
  const { algorithm = 'aes-256-ctr', password } = options
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  /* eslint-disable node/no-deprecated-api */
  const decipher = crypto.createDecipher(
    algorithm,
    password || functions.config().encryption.password
  )
  /* eslint-enable node/no-deprecated-api */
  let dec = decipher.update(str, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export default { encrypt, decrypt }
