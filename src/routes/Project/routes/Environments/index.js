import { paths } from 'constants'

export default store => ({
  path: paths.projectEnvironments,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const Environments = require('./components/EnvironmentsPage').default

        /*  Return getComponent   */
        cb(null, Environments)

        /* Webpack named bundle   */
      },
      'Environments'
    )
  }
})
