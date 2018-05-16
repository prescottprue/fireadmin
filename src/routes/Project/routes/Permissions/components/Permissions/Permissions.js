import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import PermissionsTable from '../PermissionsTable'
import classes from './Permissions.scss'

export const Permissions = ({ projectId }) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>Permissions</Typography>
    <div className={classes.container}>
      <div className={classes.buttons}>
        <Button
          // disabled={!selectedTemplate || actionProcessing}
          color="primary"
          variant="raised"
          aria-label="Run Action"
          onClick={() => {}}>
          Add Member
        </Button>
      </div>
      <PermissionsTable projectId={projectId} />
    </div>
  </div>
)

Permissions.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default Permissions
