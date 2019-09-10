import { Loadable } from 'utils/components'
import { PROJECT_ENVIRONMENTS_PATH as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(
        /* webpackChunkName: 'ProjectEnvironments' */ './components/EnvironmentsPage'
      )
  })
}
