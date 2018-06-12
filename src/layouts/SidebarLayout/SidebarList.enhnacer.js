import { compose } from 'redux'
import { withStyles } from '@material-ui/core/styles'
import { withHandlers } from 'recompose'
import { withRouter } from 'utils/components'
import { LIST_PATH } from 'constants'
import styles from './SidebarLayout.styles'

export default compose(
  withRouter,
  withHandlers({
    goTo: ({ router }) => value => {
      router.push(`${LIST_PATH}/${router.params.projectId}/${value}`)
    },
    itemIsActive: ({ router }) => value => {
      const currentParentRoute = `${LIST_PATH}/${router.params.projectId}/`
      return value === ''
        ? `${router.getCurrentLocation().pathname}/` === currentParentRoute ||
            router.getCurrentLocation().pathname === currentParentRoute
        : router.isActive(`${currentParentRoute}${value}/`)
    }
  }),
  withStyles(styles, { withTheme: true })
)
