import { firebase, googleApis } from '../config'
import { version } from '../../package.json'

const environment = process.env.NODE_ENV

let errorHandler

export function init() {
  if (environment === 'production' && googleApis && googleApis.apiKey) {
    window.addEventListener('DOMContentLoaded', () => {
      errorHandler = new window.StackdriverErrorReporter()
      errorHandler.start({
        key: googleApis.apiKey,
        projectId: firebase.projectId,
        service: 'fireadmin-site',
        version
      })
    })
  } else {
    errorHandler = console.error // eslint-disable-line no-console
  }
  return errorHandler
}

export default errorHandler
