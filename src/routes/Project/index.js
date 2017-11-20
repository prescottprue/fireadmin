export default store => ({
  path: 'projects/:projectId',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        /*  Webpack - use require callback to define
          dependencies for bundling   */
        const Project = require('./components/ProjectPage').default
        // const reducer = require('./modules/reducer').default

        /*  Return getComponent   */
        cb(null, Project)

        /* Webpack named bundle   */
      },
      'Project'
    )
  },
  getChildRoutes(partialNextState, cb) {
    require.ensure([], require => {
      /*  Webpack - use require callback to define
          dependencies for bundling   */
      const Environments = require('./routes/Environments').default
      const Migration = require('./routes/Migration').default

      /*  Return getComponent   */
      cb(null, [Migration(store), Environments(store)])
    })
  }
})
