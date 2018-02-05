import { paths } from 'constants'

export default store => ({
  path: paths.actionTemplates,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const ActionTemplates = require('./components/ActionTemplatesPage')
          .default

        /*  Return getComponent   */
        cb(null, ActionTemplates)

        /* Webpack named bundle   */
      },
      'ActionTemplates'
    )
  }
})
