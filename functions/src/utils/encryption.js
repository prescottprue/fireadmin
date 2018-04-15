import crypto from 'crypto'
import { isString } from 'lodash'
import * as functions from 'firebase-functions'

export const encrypt = (text, options = {}) => {
  const { algorithm = 'aes-256-ctr', password } = options
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const cipher = crypto.createCipher(
    algorithm,
    password || functions.config().encryption.password
  )
  let crypted = cipher.update(str, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const decrypt = (text, options = {}) => {
  const { algorithm = 'aes-256-ctr', password } = options
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const decipher = crypto.createDecipher(
    algorithm,
    password || functions.config().encryption.password
  )
  let dec = decipher.update(str, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export default { encrypt, decrypt }
