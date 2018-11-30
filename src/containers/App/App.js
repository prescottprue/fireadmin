import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router } from 'react-router-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { PersistGate } from 'redux-persist/integration/react'
import { Provider } from 'react-redux'
import ThemeSettings from 'theme'

const theme = createMuiTheme(ThemeSettings)

function App({ routes, store, persistor }) {
  return (
    <MuiThemeProvider theme={theme}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Router history={browserHistory}>{routes}</Router>
        </PersistGate>
      </Provider>
    </MuiThemeProvider>
  )
}

App.propTypes = {
  routes: PropTypes.object.isRequired,
  persistor: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default App
