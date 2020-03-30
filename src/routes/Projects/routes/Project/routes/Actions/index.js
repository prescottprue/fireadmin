import { loadable } from 'utils/router'
import { PROJECT_ACTION_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(/* webpackChunkName: 'ProjectActions' */ './components/ActionsPage')
  )
}
