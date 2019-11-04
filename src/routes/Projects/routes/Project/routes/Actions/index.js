import { Loadable } from 'utils/components'
import { PROJECT_ACTION_PATH as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(
        /* webpackChunkName: 'ProjectActions' */ './components/ActionsPage'
      )
  })
}
