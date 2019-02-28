import { Loadable } from 'utils/components'
import { ACTION_TEMPLATES_PATH as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'ActionTemplates' */ './components/ActionTemplatesPage')
  })
}
