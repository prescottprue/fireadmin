/**
 * Confirm value exists or return 'Required' error message
 * @param {Any} value - Value to check for existance
 */
export function required(value) {
  return value ? undefined : 'Required'
}

/**
 * Confirm that string is a valid email
 * @param {String} value - String to validate as an emai
 */
export function validateEmail(value) {
  return value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address'
    : undefined
}

/**
 * Confirm that string is a valid Firebase Database URL
 * @param {String} value - String to validate as a databse url
 */
export function validateDatabaseUrl(value) {
  if (value && (!value.match('http') || !value.match('firebaseio.com'))) {
    return 'Invalid databaseURL. Copy from Firebase Auth UI.'
  }
  return undefined
}
