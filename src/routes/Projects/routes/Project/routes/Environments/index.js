import { loadable } from 'utils/router'
import { PROJECT_ENVIRONMENTS_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'ProjectEnvironments' */ './components/EnvironmentsPage'
    )
  )
}
