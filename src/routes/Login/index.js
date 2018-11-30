import { Loadable } from 'utils/components'
import { LOGIN_PATH as path } from 'constants'

export default {
  path,
  component: Loadable({
    loader: () =>
      import(/* webpackChunkName: 'Login' */ './components/LoginPage')
  })
}
