import { Loadable } from 'utils/components'
import { paths } from 'constants'

export default {
  path: paths.projectBucketConfig,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'BucketConfig' */ './components/BucketConfigPage')
  })
}
