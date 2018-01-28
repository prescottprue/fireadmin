import crypto from 'crypto'
import { isString } from 'lodash'

export const encrypt = (text, { algorithm = 'aes-256-ctr', password }) => {
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(str, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const decrypt = (text, { algorithm = 'aes-256-ctr', password }) => {
  if (!text) {
    return
  }
  const str = !isString(text) ? JSON.stringify(text) : text
  const decipher = crypto.createDecipher(algorithm, password)
  let dec = decipher.update(str, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export default { encrypt, decrypt }
