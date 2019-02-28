import { Loadable } from 'utils/components'

export default {
  path: 'projects/:projectId',
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'BucketConfig' */ './components/ProjectPage')
  })
}
