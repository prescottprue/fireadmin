import { Loadable } from 'utils/components'

export default {
  path: '*',
  component: Loadable({
    loader: () => import(/* webpackChunkName: 'NotFound' */ './NotFound')
  })
}
