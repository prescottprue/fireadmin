import { Loadable } from 'utils/components'
import { paths } from 'constants'

export default {
  path: paths.projectEvents,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'ProjectEventsPage' */ './components/ProjectEventsPage')
  })
}
