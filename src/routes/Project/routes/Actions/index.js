import { paths } from 'constants'

export default store => ({
  path: paths.projectActions,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const Actions = require('./components/ActionsPage').default

        /*  Return getComponent   */
        cb(null, Actions)

        /* Webpack named bundle   */
      },
      'Actions'
    )
  }
})
