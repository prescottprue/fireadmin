import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory, Router } from 'react-router'
import { Provider } from 'react-redux'
// import VersionChangeReloader from 'components/VersionChangeReloader'
import { handleRouteUpdate } from 'utils/router'
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles'
import Theme from 'theme'

const theme = createMuiTheme(Theme)

const App = ({ routes, store }) => (
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Router history={browserHistory} onUpdate={handleRouteUpdate}>
        {routes}
      </Router>
    </MuiThemeProvider>
  </Provider>
)

App.propTypes = {
  routes: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
}

export default App
