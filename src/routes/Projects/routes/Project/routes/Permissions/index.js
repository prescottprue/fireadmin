import { loadable } from 'utils/router'
import { PERMISSIONS_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'ProjectPermissions' */ './components/Permissions'
    )
  )
}
