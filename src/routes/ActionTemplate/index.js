import { paths } from 'constants'

export default store => ({
  path: `${paths.actionTemplates}/:templateId`,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const ActionTemplate = require('./components/ActionTemplatePage')
          .default

        /*  Return getComponent   */
        cb(null, ActionTemplate)

        /* Webpack named bundle   */
      },
      'ActionTemplate'
    )
  }
})
