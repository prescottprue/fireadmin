import { Loadable } from 'utils/components'
import { paths } from 'constants'

export default store => ({
  path: paths.projectActions,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Actions' */ './components/ActionsPage')
  })
})
