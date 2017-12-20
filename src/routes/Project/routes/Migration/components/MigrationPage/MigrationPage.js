import React from 'react'
import PropTypes from 'prop-types'
import Button from 'material-ui-next/Button'
import BackupsCard from '../BackupsCard'
import ChangesCard from '../ChangesCard'
import NotificationsCard from '../NotificationsCard'
import classes from './MigrationPage.scss'

export const MigrationPage = props => (
  <div>
    <h2>Data Migration</h2>
    <div>
      <Button raised color="primary" onTouchTap={props.runMigration}>
        Run Migration
      </Button>
      <Button raised disabled color="primary" className={classes.button}>
        Export Settings
      </Button>
      <Button raised disabled color="primary" className={classes.button}>
        Save As Template
      </Button>
    </div>
    <div className="flex-row-center">
      <BackupsCard {...props} />
    </div>
    <div className="flex-row-center">
      <ChangesCard {...props} />
    </div>
    <div className="flex-row-center">
      <NotificationsCard {...props} />
    </div>
  </div>
)

MigrationPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  runMigration: PropTypes.func.isRequired,
  serviceAccounts: PropTypes.object
}

export default MigrationPage
