function waitForResponseWith(ref, pathForValue = 'completed', value) {
  return new Promise((resolve, reject) => {
    ref.on(
      'value',
      (responseSnap) => {
        const response = responseSnap.val()
        if (response && response[pathForValue]) {
          if (value && response[pathForValue] !== value) {
            return
          }
          resolve(response)
        }
      },
      (err) => {
        console.error('Error waiting for response:', err.message || err) // eslint-disable-line no-console
        reject(err)
      }
    )
  })
}

function createWaitForValue(...args) {
  return (ref) => waitForResponseWith(ref, ...args)
}

export const waitForCompleted = createWaitForValue('completed', true)
