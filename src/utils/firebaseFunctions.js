import { invoke, get } from 'lodash'

export function waitForResponseWith(ref, pathForValue = 'completed', value) {
  return new Promise((resolve, reject) => {
    ref.on(
      'value',
      responseSnap => {
        const response = invoke(responseSnap, 'val')
        if (get(response, pathForValue)) {
          if (value && get(response, pathForValue) !== value) {
            return
          }
          resolve(response)
        }
      },
      err => {
        console.error('Error waiting for response:', err.message || err) // eslint-disable-line no-console
        reject(err)
      }
    )
  })
}

export const createWaitForValue = (...args) => ref =>
  waitForResponseWith(ref, ...args)

export const waitForCompleted = createWaitForValue('completed', true)
