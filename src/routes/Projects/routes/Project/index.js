import { Loadable } from 'utils/components'

export default {
  path: ':projectId',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'ProjectPage' */ './components/ProjectPage')
  })
}
