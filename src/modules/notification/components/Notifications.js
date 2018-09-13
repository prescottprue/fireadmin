import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { size } from 'lodash'
import { connect } from 'react-redux'
import { pure, compose, renderNothing, branch } from 'recompose'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import * as actions from '../actions'
import { withStyles } from '@material-ui/core/styles'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon
}

export const Notifications = ({
  classes,
  className,
  allIds,
  byId,
  variant = 'info',
  dismissNotification
}) => {
  return (
    <div>
      {allIds.map(id => {
        const Icon = variantIcon[byId[id].type] || variantIcon[variant]
        return (
          <Snackbar
            key={id}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            open
            className={classes.snackbar}>
            <SnackbarContent
              className={classNames(
                classes[byId[id].type] || classes[variant],
                className
              )}
              aria-describedby="client-snackbar"
              message={
                <span id="client-snackbar" className={classes.message}>
                  <Icon
                    className={classNames(classes.icon, classes.iconVariant)}
                  />
                  {byId[id].message}
                </span>
              }
              action={[
                <IconButton
                  key="close"
                  aria-label="Close"
                  color="inherit"
                  className={classes.close}
                  onClick={() => dismissNotification(id)}>
                  <CloseIcon className={classes.icon} />
                </IconButton>
              ]}
            />
          </Snackbar>
        )
      })}
    </div>
  )
}

Notifications.propTypes = {
  allIds: PropTypes.array.isRequired,
  byId: PropTypes.object.isRequired,
  variant: PropTypes.string,
  className: PropTypes.string,
  classes: PropTypes.object.isRequired,
  dismissNotification: PropTypes.func.isRequired
}

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    // backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
})

export default compose(
  pure,
  withStyles(styles),
  connect(
    ({ notifications: { allIds, byId } }) => ({ allIds, byId }),
    actions
  ),
  branch(props => !size(props.allIds), renderNothing), // only render if notifications exist
  withStyles(styles)
)(Notifications)
