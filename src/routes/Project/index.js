import { Loadable } from 'utils/components'

export default store => ({
  path: 'projects/:projectId',
  /*  Async getComponent is only invoked when route matches   */
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Project' */ './components/ProjectPage')
  }),
  getChildRoutes(partialNextState, cb) {
    return Promise.all(
      [
        'Actions',
        'Environments',
        'BucketConfig',
        'ProjectEvents',
        'Permissions'
      ].map(routeName => import(`./routes/${routeName}`))
    ).then(cb)
  }
})
