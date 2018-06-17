import Nightmare from 'nightmare'
import config from '../config'

const {
  nightmare: { logging }
} = config

Nightmare.action('activateLogging', function(done) {
  if (logging) {
    this.on('console', (log, msg) => {
      console.log(msg) // eslint-disable-line no-console
    }).then(done)
  } else {
    this.then(done)
  }
})

Nightmare.action('log', function(message, done) {
  if (logging) {
    this.evaluate_now(
      msg => {
        // eslint-disable-line no-shadow
        function log() {
          console.log(`Nightmare log: ${msg}`) // eslint-disable-line no-console
        }
        log()
      },
      done,
      message
    ).then(done)
  } else {
    this.then(done)
  }
})
