import React, { Suspense } from 'react'
import PropTypes from 'prop-types'
import { AuthCheck } from 'reactfire'
import { Route, useRouteMatch, Redirect } from 'react-router-dom'
import LoadingSpinner from 'components/LoadingSpinner'
import { LOGIN_PATH } from 'constants/paths'

/**
 * Render children based on route config objects
 * @param {Array} routes - Routes settings array
 * @param {Object} parentProps - Props to pass to children from parent
 */
export function renderChildren(routes, parentProps) {
  return routes.map((route) => {
    const match = useRouteMatch()
    const RouteComponent = route.authRequired ? PrivateRoute : Route
    return (
      <RouteComponent
        key={`${match.url}-${route.path}`}
        path={`${match.url}/${route.path}`}
        render={(props) => <route.component {...parentProps} {...props} />}
      />
    )
  })
}

/**
 * A wrapper for <Route> that redirects to the login
 * @param {Object} props - Route props
 * @param {string} props.path - Path of route
 * @param {React.Component} props.component - Path of route
 * @returns {React.Component}
 */
export function PrivateRoute({ path, ...rest }) {
  return (
    <AuthCheck
      key={path}
      fallback={
        <Redirect
          to={{
            pathname: LOGIN_PATH,
            state: { from: path }
          }}
        />
      }>
      <Route key={`Route-${path}`} path={path} {...rest} />
    </AuthCheck>
  )
}

PrivateRoute.propTypes = {
  path: PropTypes.string.isRequired,
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.element])
}

/**
 * Create component which is loaded async, showing a loading spinner
 * in the meantime.
 * @param {Function} loadFunc - Loading options
 * @returns {React.Component}
 */
export function loadable(loadFunc) {
  const OtherComponent = React.lazy(loadFunc)
  return function LoadableWrapper(loadableProps) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <OtherComponent {...loadableProps} />
      </Suspense>
    )
  }
}
