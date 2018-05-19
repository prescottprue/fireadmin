import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import PermissionsTable from '../PermissionsTable'
import classes from './Permissions.scss'

export const Permissions = ({ projectId, handleSubmit, submitting }) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Permissions</Typography>
    <form className={classes.container} onSubmit={handleSubmit}>
      <div className={classes.buttons}>
        <Button
          disabled={submitting}
          color="primary"
          variant="raised"
          aria-label="Add Member"
          onClick={() => {}}>
          Add Member
        </Button>
      </div>
      <PermissionsTable projectId={projectId} />
    </form>
  </div>
)

Permissions.propTypes = {
  projectId: PropTypes.string.isRequired,
  submitting: PropTypes.bool.isRequired,
  handleSubmit: PropTypes.func.isRequired
}

export default Permissions
