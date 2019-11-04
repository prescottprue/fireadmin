import { Loadable } from 'utils/components'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'

export default {
  path: `${ACTION_TEMPLATES_PATH}/:templateId`,
  component: Loadable({
    loader: () =>
      import(
        /* webpackChunkName: 'ActionTemplate' */ './components/ActionTemplatePage'
      )
  })
}
