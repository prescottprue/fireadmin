import React from 'react'
import PropTypes from 'prop-types'
import { BrowserRouter as Router } from 'react-router-dom'
import { FirebaseAppProvider, SuspenseWithPerf } from 'reactfire'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import NotificationsProvider from 'modules/notification/NotificationsProvider'
import SetupMessaging from 'components/SetupMessaging'
import ThemeSettings from 'theme'
import { ErrorBoundary } from 'utils/components'

const theme = createMuiTheme(ThemeSettings)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_apiKey,
  authDomain: process.env.REACT_APP_FIREBASE_authDomain,
  databaseURL: process.env.REACT_APP_FIREBASE_databaseURL,
  projectId: process.env.REACT_APP_FIREBASE_projectId,
  storageBucket: process.env.REACT_APP_FIREBASE_storageBucket,
  messagingSenderId: process.env.REACT_APP_FIREBASE_messagingSenderId,
  measurementId: process.env.REACT_APP_FIREBASE_measurementId,
  appId: process.env.REACT_APP_FIREBASE_appId
}

// Enable Real Time Database emulator if environment variable is set
if (process.env.REACT_APP_FIREBASE_DATABASE_EMULATOR_HOST) {
  firebaseConfig.databaseURL = `http://${process.env.REACT_APP_FIREBASE_DATABASE_EMULATOR_HOST}?ns=${process.env.REACT_APP_FIREBASE_projectId}`
  console.debug(`RTDB emulator enabled: ${firebaseConfig.databaseURL}`) // eslint-disable-line no-console
}

console.log('-------- client firebase config', firebaseConfig)

function App({ routes }) {
  return (
    <MuiThemeProvider theme={theme}>
      <FirebaseAppProvider firebaseConfig={firebaseConfig} initPerformance>
        <NotificationsProvider>
          <>
            <ErrorBoundary>
              <Router>{routes}</Router>
            </ErrorBoundary>
            <SuspenseWithPerf traceId="load-messaging">
              <SetupMessaging />
            </SuspenseWithPerf>
          </>
        </NotificationsProvider>
      </FirebaseAppProvider>
    </MuiThemeProvider>
  )
}

App.propTypes = {
  routes: PropTypes.object.isRequired
}

export default App
