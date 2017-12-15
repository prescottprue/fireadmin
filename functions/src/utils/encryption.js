import crypto from 'crypto'

export const encrypt = (text, { algorithm = 'aes-256-ctr', password }) => {
  if (!text) {
    return
  }
  const cipher = crypto.createCipher(algorithm, password)
  let crypted = cipher.update(text, 'utf8', 'hex')
  crypted += cipher.final('hex')
  return crypted
}

export const decrypt = (text, { algorithm = 'aes-256-ctr', password }) => {
  if (!text) {
    return
  }
  const decipher = crypto.createDecipher(algorithm, password)
  let dec = decipher.update(text, 'hex', 'utf8')
  dec += decipher.final('utf8')
  return dec
}

export default { encrypt, decrypt }
