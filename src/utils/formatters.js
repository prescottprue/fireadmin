import { isDate } from 'lodash'
import { format } from 'date-fns'

export function formatTime(dateValue = null) {
  const dateObject = isDate(dateValue) ? dateValue : new Date(dateValue)
  return format(dateObject, 'h:mm:ss a')
}

export function formatDate(dateValue = null) {
  const dateObject = isDate(dateValue) ? dateValue : new Date(dateValue)
  return format(dateObject, 'MM-DD-YY')
}
