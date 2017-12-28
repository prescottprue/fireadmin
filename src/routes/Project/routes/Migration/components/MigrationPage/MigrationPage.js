import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import Typography from 'material-ui-next/Typography'
import { Link } from 'react-router'
import { paths } from 'constants'
import classes from './MigrationPage.scss'

export const MigrationPage = props => (
  <div>
    <Typography className={classes.pageHeader}>Data Migration</Typography>
    <div>
      <Button raised disabled color="primary" onTouchTap={props.runMigration}>
        Run Migration
      </Button>
      <Typography>
        Run a data migration by selecting a template then clicking run migration
      </Typography>
    </div>
    <div className="flex-row-center">
      <Link to={paths.dataMigration}>
        <Button raised color="primary" className={classes.button}>
          Create New Migration Template
        </Button>
      </Link>
    </div>
  </div>
)

MigrationPage.propTypes = {
  // project: PropTypes.object,
  // params: PropTypes.object,
  // serviceAccounts: PropTypes.object,
  runMigration: PropTypes.func.isRequired
}

export default MigrationPage
