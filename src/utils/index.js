import { initSegment } from './analytics'
import { init as initErrorHandler } from './errorHandler'

/**
 * Initialize global scripts including analytics and error handling
 */
export function initScripts() {
  initErrorHandler()
  initSegment()
}

export function databaseURLToProjectName(databaseURL) {
  const strMatch = databaseURL?.match(/https:\/\/(.*)\.firebaseio\.com/)
  return strMatch && strMatch[1]
}
