import chai from 'chai'
import Nightmare from 'nightmare'
import config from '../config'
import '../actions/inputs'
import '../actions/login'
import '../actions/log'

require('nightmare-upload')(Nightmare)
require('nightmare-window-manager')(Nightmare)

const nightmare = Nightmare(config.nightmare)

global.chai = chai
global.expect = chai.expect
global.assert = chai.assert
global.Nightmare = Nightmare
global.nightmare = nightmare
