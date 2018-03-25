import * as functions from 'firebase-functions'
import Mocha from 'mocha'
import path from 'path'

export default functions.onCall.onRequest((req, res) => {
  // Add each .js file to the mocha instance
  // fs.readdirSync(testDir).filter(function(file){
  //     // Only keep the .js files
  //     return file.substr(-3) === '.js';
  //
  // }).forEach(function(file){
  //     mocha.addFile(
  //         path.join(testDir, file)
  //     );
  // });
  const mocha = new Mocha({
    useColors: true
  })
  mocha.addFile(path.join(__dirname, './some.js'))
  mocha.run(failures => {
    console.log('failed:', failures)
    if (failures === 0) {
      res.send('Success!')
    }
    process.on('exit', function() {
      console.log('second failed:', failures)
      res.send(failures) // exit with non-zero status if there were failures
    })
  })
})
