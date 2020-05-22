import { loadable } from 'utils/router'
import { ACTION_TEMPLATES_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'ActionTemplates' */ './components/ActionTemplatesPage'
    )
  )
}
