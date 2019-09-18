import React from 'react'
import { Switch, Route } from 'react-router-dom'
import CoreLayout from '../layouts/CoreLayout'
import AccountRoute from './Account'
import ActionTemplateRoute from './ActionTemplate'
import ActionTemplatesRoute from './ActionTemplates'
import Home from './Home'
import LoginRoute from './Login'
import NotFoundRoute from './NotFound'
import ProjectsRoute from './Projects'
import SignupRoute from './Signup'

export default function createRoutes(store) {
  return (
    <CoreLayout>
      <Switch>
        <Route exact path={Home.path} component={() => <Home.component />} />
        {/* Build Route components from routeSettings */
        [
          ActionTemplateRoute,
          ActionTemplatesRoute,
          AccountRoute,
          ProjectsRoute,
          SignupRoute,
          LoginRoute
          /* Add More Routes Here */
        ].map((settings, index) => (
          <Route key={`Route-${index}`} {...settings} />
        ))}
        <Route component={NotFoundRoute.component} />
      </Switch>
    </CoreLayout>
  )
}
