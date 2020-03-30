import { loadable } from 'utils/router'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'

export default {
  path: `${ACTION_TEMPLATES_PATH}/:templateId`,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'ActionTemplate' */ './components/ActionTemplatePage'
    )
  )
}
