import { Loadable } from 'utils/components'
import { LIST_PATH as path } from 'constants'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Projects' */ './components/ProjectsPage')
  })
}
