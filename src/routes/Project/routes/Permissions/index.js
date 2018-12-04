import { Loadable } from 'utils/components'
import { PERMISSIONS_PATH as path } from 'constants'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Permissions' */ './components/Permissions')
  })
}
