import { compose } from 'redux'
import { withStyles } from 'material-ui-next/styles'
import { withHandlers } from 'recompose'
import { withRouter } from 'utils/components'
import styles from './SidebarLayout.styles'

export default compose(
  withRouter,
  withHandlers({
    goTo: ({ router }) => value => {
      router.push(`/projects/${router.params.projectId}/${value}`)
    },
    itemIsActive: ({ router }) => value => {
      return router.isActive(`projects/${router.params.projectId}/${value}`)
    }
  }),
  withStyles(styles, { withTheme: true })
)
