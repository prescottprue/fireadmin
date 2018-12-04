import { paths } from 'constants'
import { Loadable } from 'utils/components'

export default {
  path: paths.actionTemplates,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'ActionTemplates' */ './components/ActionTemplatesPage')
  })
}
