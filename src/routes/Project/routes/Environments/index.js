import { Loadable } from 'utils/components'
import { paths } from 'constants'

export default {
  path: paths.projectEnvironments,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Environments' */ './components/EnvironmentsPage')
  })
}
