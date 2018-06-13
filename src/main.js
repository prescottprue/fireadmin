import React from 'react'
import ReactDOM from 'react-dom'
import { version as rfVersion } from 'redux-firestore'
import createStore from './store/createStore'
import { initScripts } from './utils'
import { env } from './config'
import { version } from '../package.json'
import './styles/core.scss'

// Window Variables
// ------------------------------------
window.version = version
// window.rrfversion = dependencies['react-redux-firebase']
window.rfversion = rfVersion
window.env = env
initScripts()

// Store Initialization
// ------------------------------------
const initialState = window.___INITIAL_STATE__ || {
  firebase: { authError: null }
}
const store = createStore(initialState)

// Render Setup
// ------------------------------------
const MOUNT_NODE = document.getElementById('root')

let render = () => {
  const App = require('./containers/App').default
  const routes = require('./routes/index').default(store)

  ReactDOM.render(<App store={store} routes={routes} />, MOUNT_NODE)
}

// Development Tools
// ------------------------------------
if (__DEV__) {
  if (module.hot) {
    const renderApp = render
    const renderError = error => {
      const RedBox = require('redbox-react').default

      ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
    }

    render = () => {
      try {
        renderApp()
      } catch (e) {
        console.error(e) // eslint-disable-line no-console
        renderError(e)
      }
    }

    // Setup hot module replacement
    module.hot.accept(['./containers/App', './routes/index'], () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE)
        render()
      })
    )
  }
}

// Let's Go!
// ------------------------------------
if (!__TEST__) render()
