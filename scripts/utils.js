const stream = require('stream')
const { spawn } = require('child_process')

/**
 * Run a bash command using spawn pipeing the results to the main
 * process
 * @param {string} command - Command to be executed
 * @returns {Promise} Resolves with results of running command
 * @private
 */
function runCommand(command, args, options) {
  const { pipeOutput = true } = options || {}
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: process.env, shell: true })
    let output
    let error
    const customStream = new stream.Writable()
    const customErrorStream = new stream.Writable()
    customStream._write = (data, ...argv) => {
      output += data
      if (pipeOutput) {
        process.stdout._write(data, ...argv)
      }
    }
    customErrorStream._write = (data, ...argv) => {
      error += data
      if (pipeOutput) {
        process.stderr._write(data, ...argv)
      }
    }
    // Pipe errors and console output to main process
    child.stdout.pipe(customStream)
    child.stderr.pipe(customErrorStream)
    // When child exits resolve or reject based on code
    child.on('exit', (code, signal) => {
      if (code !== 0) {
        reject(error || output)
      } else {
        // Remove leading undefined from response
        if (output && output.indexOf('undefined') === 0) {
          resolve(output.replace('undefined', ''))
        } else {
          resolve(output)
        }
      }
    })
  })
}

module.exports = {
  runCommand
}
