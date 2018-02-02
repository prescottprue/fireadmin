import { isDate } from 'lodash'
import { format } from 'date-fns'

/**
 * Convert date string or object into date object
 * @param  {[type]} [dateValue=null] - Date value which to format
 * @return {Date} Formatted time
 */
export function getDateObject(dateValue = null) {
  return isDate(dateValue) ? dateValue : new Date(dateValue)
}

/**
 * Format date to time with am/pm
 * @param  {[type]} dateValue - Date value which to format
 * @return {String} Formatted time
 */
export function formatTime(dateValue) {
  return format(getDateObject(dateValue), 'h:mm:ss.LL a')
}

/**
 * Format date string or object into date string with format 1/22/2018
 * @param  {Object} dateValue - Date value which to format
 * @return {String} Formatted date
 */
export function formatDate(dateValue) {
  return format(getDateObject(dateValue), 'MM/DD/YY')
}
