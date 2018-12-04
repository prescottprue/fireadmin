import { Loadable } from 'utils/components'
import { paths } from 'constants'

export default {
  path: `${paths.actionTemplates}/:templateId`,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'ActionTemplate' */ './components/ActionTemplatePage')
  })
}
