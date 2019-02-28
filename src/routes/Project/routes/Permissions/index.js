import { Loadable } from 'utils/components'
import { PERMISSIONS_PATH as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'ProjectPermissions' */ './components/Permissions')
  })
}
