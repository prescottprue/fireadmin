import { Loadable } from 'utils/components'
import { PROJECT_EVENTS_PATH as path } from 'constants/paths'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(
        /* webpackChunkName: 'ProjectEvents' */ './components/ProjectEventsPage'
      )
  })
}
