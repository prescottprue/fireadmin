global.window = {}
const Firepad = require('firepad')

export function getFirepadContent(firebaseRef) {
  return new Promise((resolve, reject) => {
    try {
      const headless = new Firepad.Headless(firebaseRef)
      headless.getText(text => {
        console.log('Contents of firepad retrieved: ' + text)
        resolve(text)
      })
    } catch (err) {
      console.error('Error getting contents of Firepad', err.message || err)
      reject(err)
    }
  })
}
