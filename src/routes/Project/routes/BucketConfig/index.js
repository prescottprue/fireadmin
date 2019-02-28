import { Loadable } from 'utils/components'
import { PROJECT_BUCKET_CONFIG_PATH as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'BucketConfig' */ './components/BucketConfigPage')
  })
}
