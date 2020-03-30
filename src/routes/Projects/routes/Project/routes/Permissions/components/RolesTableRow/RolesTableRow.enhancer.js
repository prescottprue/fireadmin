import PropTypes from 'prop-types'
import { compose } from 'redux'
import { setPropTypes, withStateHandlers } from 'recompose'
import { reduxForm } from 'redux-form'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { getCurrentUserCreatedProject } from 'selectors'
import { createPermissionChecker } from 'utils'
import styles from './RolesTableRow.styles'

export default compose(
  setPropTypes({
    onSubmit: PropTypes.func.isRequired,
    form: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired // used in selectors
  }),
  // Add form capabilities (name passed as prop)
  reduxForm(),
  withStateHandlers(
    () => ({
      anchorEl: null,
      deleteDialogOpen: false
    }),
    {
      handleMenuClick: () => (e) => ({
        anchorEl: e.target
      }),
      handleMenuClose: () => () => ({
        anchorEl: null
      }),
      startDelete: () => () => ({
        deleteDialogOpen: true,
        anchorEl: null
      }),
      handleDeleteClose: () => () => ({
        deleteDialogOpen: false
      })
    }
  ),
  withStyles(styles),
  connect((state, props) => {
    const userHasPermission = createPermissionChecker(state, props)
    const hasUpdatePermission = userHasPermission('update.roles')
    const userCreatedProject = getCurrentUserCreatedProject(state, props)
    // Disable update button if the current user is not the project creator and
    // also does not have roles update permission
    return {
      updateRolesDisabled: !userCreatedProject && !hasUpdatePermission
    }
  })
)
