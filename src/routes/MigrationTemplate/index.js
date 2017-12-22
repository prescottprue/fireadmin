import { paths } from 'constants'

export default store => ({
  path: `${paths.dataMigration}/:templateId`,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const MigrationTemplate = require('./components/MigrationTemplatePage')
          .default

        /*  Return getComponent   */
        cb(null, MigrationTemplate)

        /* Webpack named bundle   */
      },
      'MigrationTemplate'
    )
  }
})
