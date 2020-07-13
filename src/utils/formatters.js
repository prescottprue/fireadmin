import { isDate } from 'lodash'
import { format } from 'date-fns'

/**
 * Convert date string or object into date object
 * @param {firebase.firestore.Timestamp|Date|String} [dateValue=null] - Date value which to format
 * @return {Date} Formatted time
 */
export function getDateObject(dateValue = null) {
  if (dateValue && typeof dateValue.toDate === 'function') {
    return dateValue.toDate()
  }
  return isDate(dateValue) ? dateValue : new Date(dateValue)
}

/**
 * Format date to time with am/pm
 * @param {firebase.firestore.Timestamp|Date|String} dateValue - Date value which to format
 * @return {String} Formatted time
 */
export function formatTime(dateValue) {
  return format(getDateObject(dateValue), 'h:mm:ss.SSS A')
}

/**
 * Format date string or object into date string with format 1/22/2018
 * @param {firebase.firestore.Timestamp|Date|String} dateValue - Date value which to format
 * @return {String} Formatted date
 */
export function formatDate(dateValue) {
  return format(getDateObject(dateValue), 'MM/DD/YY')
}

/**
 * Format date string or object into date string with format
 * 1/22/2018 - 3:30:25.123 AM
 * @param {firebase.firestore.Timestamp|Date|String} dateValue - Date value which to format
 * @return {String} Formatted date
 */
export function formatDateTime(dateValue) {
  return format(getDateObject(dateValue), 'MM/DD/YY - h:mm:ss.SSS A')
}
