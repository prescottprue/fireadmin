import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router } from 'react-router-dom'
import { FirebaseAppProvider } from 'reactfire'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import { Provider } from 'react-redux'
import { NotificationsProvider } from 'modules/notification'
import ThemeSettings from 'theme'
import * as config from 'config'

const theme = createMuiTheme(ThemeSettings)

function App({ routes, store }) {
  return (
    <MuiThemeProvider theme={theme}>
      <FirebaseAppProvider firebaseConfig={config.firebase} initPerformance>
        <NotificationsProvider>
          <Provider store={store}>
            <Router>{routes}</Router>
          </Provider>
        </NotificationsProvider>
      </FirebaseAppProvider>
    </MuiThemeProvider>
  )
}

App.propTypes = {
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default App
