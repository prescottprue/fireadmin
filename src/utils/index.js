import { initGA } from './analytics'
import { init as initErrorHandler } from './errorHandler'

export const initScripts = () => {
  initGA()
  initErrorHandler()
}

export const databaseURLToProjectName = databaseURL =>
  databaseURL.replace('https://', '').replace('.firebaseio.com', '')
