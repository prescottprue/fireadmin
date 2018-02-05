import { size, pick } from 'lodash'

export function hasAll(obj, keysList) {
  return size(pick(obj, keysList)) === size(keysList)
}
