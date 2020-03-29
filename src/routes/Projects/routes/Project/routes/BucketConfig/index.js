import { loadable } from 'utils/router'
import { PROJECT_BUCKET_CONFIG_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'BucketConfig' */ './components/BucketConfigPage'
    )
  )
}
