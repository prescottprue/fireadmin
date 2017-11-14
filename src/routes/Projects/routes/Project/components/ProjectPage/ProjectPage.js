import React from 'react'
import PropTypes from 'prop-types'
import MigrationMetaTile from '../MigrationMetaTile'
import SidebarLayout from 'layouts/SidebarLayout'
import { map } from 'lodash'
import Button from 'material-ui-next/Button'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import classesFromStyles from './ProjectPage.scss'

export const ProjectPage = ({
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
  uploadServiceAccount
}) => (
  <SidebarLayout title={project.name}>
    <div>
      <h2>Environments</h2>
      <div style={{ marginBottom: '2rem' }}>
        <Button raised color="primary" onTouchTap={toggleDialog}>
          Add Environment
        </Button>
      </div>
      <div>
        {project.environments ? (
          <div className="flex-column">
            <div className={classesFromStyles.instances}>
              {map(project.environments, (inst, i) => (
                <Instance
                  key={`Instance-${i}`}
                  instance={inst}
                  onEditClick={() => toggleDialogWithData(inst)}
                />
              ))}
            </div>
            <MigrationMetaTile
              project={project}
              params={params}
              serviceAccounts={serviceAccounts}
            />
          </div>
        ) : (
          <span>No Environments</span>
        )}
      </div>
      <AddEnvironmentDialog
        open={envDialogOpen}
        initialValues={selectedInstance}
        onFilesDrop={uploadServiceAccount}
        onSubmit={addInstance}
        onRequestClose={toggleDialog}
        selectedAccounts={selectedAccounts}
        onAccountClick={selectServiceAccount}
        serviceAccounts={serviceAccounts}
      />
    </div>
  </SidebarLayout>
)

ProjectPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  serviceAccounts: PropTypes.object,
  selectedAccounts: PropTypes.array,
  selectedInstance: PropTypes.object,
  toggleDialogWithData: PropTypes.func,
  addInstance: PropTypes.func,
  uploadServiceAccount: PropTypes.func,
  selectServiceAccount: PropTypes.func,
  toggleDialog: PropTypes.func,
  toggleDrawer: PropTypes.func,
  classes: PropTypes.object, // added by withStyles
  envDialogOpen: PropTypes.bool,
  drawerOpen: PropTypes.bool
}

export default ProjectPage
