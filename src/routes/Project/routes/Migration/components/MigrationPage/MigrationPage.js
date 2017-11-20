import React from 'react'
import PropTypes from 'prop-types'
import MigrationMetaTile from '../MigrationMetaTile'

export const MigrationPage = ({
  project,
  params,
  classes,
  drawerOpen,
  toggleDrawer,
  toggleDialog,
  serviceAccounts,
  selectServiceAccount,
  selectedAccounts,
  selectedInstance,
  toggleDialogWithData,
  envDialogOpen,
  addInstance,
  removeEnvironment,
  uploadServiceAccount
}) => (
  <div>
    <h2>Data Migration</h2>
    <div>
      <MigrationMetaTile
        project={project}
        params={params}
        serviceAccounts={serviceAccounts}
      />
    </div>
  </div>
)

MigrationPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  serviceAccounts: PropTypes.object,
  selectedAccounts: PropTypes.array,
  selectedInstance: PropTypes.object,
  toggleDialogWithData: PropTypes.func,
  addInstance: PropTypes.func,
  uploadServiceAccount: PropTypes.func,
  selectServiceAccount: PropTypes.func,
  removeEnvironment: PropTypes.func,
  toggleDialog: PropTypes.func,
  toggleDrawer: PropTypes.func,
  classes: PropTypes.object, // added by withStyles
  envDialogOpen: PropTypes.bool,
  drawerOpen: PropTypes.bool
}

export default MigrationPage
