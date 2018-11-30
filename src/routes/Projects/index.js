import { LIST_PATH as path } from 'constants'
import { Loadable } from 'utils/components'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Projects' */ './components/ProjectsPage')
  })
}
