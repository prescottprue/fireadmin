import { paths } from 'constants'

export default store => ({
  path: paths.dataMigration,
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, cb) {
    /*  Webpack - use 'require.ensure' to create a split point
        and embed an async module loader (jsonp) when bundling   */
    require.ensure(
      [],
      require => {
        const MigrationTemplates = require('./components/MigrationTemplatesPage')
          .default

        /*  Return getComponent   */
        cb(null, MigrationTemplates)

        /* Webpack named bundle   */
      },
      'MigrationTemplates'
    )
  }
})
