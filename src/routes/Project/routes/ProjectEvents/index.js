import { paths } from 'constants'

export default store => ({
  path: paths.projectEvents,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const ProjectEvents = require('./components/ProjectEventsPage').default

        /*  Return getComponent   */
        cb(null, ProjectEvents)

        /* Webpack named bundle   */
      },
      'ProjectEvents'
    )
  }
})
