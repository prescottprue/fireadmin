import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { SuspenseWithPerf } from 'reactfire'
import AnalyticsPageViewLogger from 'components/AnalyticsPageViewLogger'
import { PrivateRoute } from 'utils/router'
import LoadingSpinner from 'components/LoadingSpinner'
import CoreLayout from '../layouts/CoreLayout'
import AccountRoute from './Account'
import ActionTemplateRoute from './ActionTemplate'
import ActionTemplatesRoute from './ActionTemplates'
import Home from './Home'
import LoginRoute from './Login'
import NotFoundRoute from './NotFound'
import ProjectsRoute from './Projects'

export default function createRoutes(store) {
  return (
    <CoreLayout>
      <SuspenseWithPerf fallback={<LoadingSpinner />} traceId="router-wait">
        <Switch>
          {/* eslint-disable react/jsx-pascal-case */}
          <Route exact path={Home.path} component={() => <Home.component />} />
          {/* eslint-enable react/jsx-pascal-case */}
          {
            /* Build Route components from routeSettings */
            [
              ActionTemplateRoute,
              ActionTemplatesRoute,
              AccountRoute,
              ProjectsRoute,
              LoginRoute
              /* Add More Routes Here */
            ].map((settings) =>
              settings.authRequired ? (
                <PrivateRoute key={`Route-${settings.path}`} {...settings} />
              ) : (
                <Route key={`Route-${settings.path}`} {...settings} />
              )
            )
          }
          <Route component={NotFoundRoute.component} />
          <SuspenseWithPerf traceId="page-view-logger">
            <AnalyticsPageViewLogger />
          </SuspenseWithPerf>
        </Switch>
      </SuspenseWithPerf>
    </CoreLayout>
  )
}
