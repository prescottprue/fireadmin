import { invoke } from 'lodash'

export const waitForResponse = (firebase, path) =>
  new Promise((resolve, reject) => {
    firebase.ref(path).on(
      'value',
      responseSnap => {
        const response = invoke(responseSnap, 'val')
        if (response) {
          resolve(response)
        }
      },
      err => {
        console.error('Error waiting for response:', err.message || err) // eslint-disable-line no-console
        reject(err)
      }
    )
  })
