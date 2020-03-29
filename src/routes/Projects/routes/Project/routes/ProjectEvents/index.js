import { loadable } from 'utils/router'
import { PROJECT_EVENTS_PATH as path } from 'constants/paths'

export default {
  path,
  component: loadable(() =>
    import(
      /* webpackChunkName: 'ProjectEvents' */ './components/ProjectEventsPage'
    )
  )
}
