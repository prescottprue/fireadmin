import { loadable } from 'utils/router'
import { PROJECT_PERMISSIONS_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'ProjectPermissions' */ './components/Permissions'
    )
  )
}
