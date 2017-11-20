import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from 'material-ui-next/Button'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import classesFromStyles from './EnvironmentsPage.scss'

export const EnvironmentsPage = ({
  project,
  params,
  classes,
  toggleDialog,
  serviceAccounts,
  selectServiceAccount,
  selectedAccounts,
  selectedInstance,
  toggleDialogWithData,
  envDialogOpen,
  addEnvironment,
  updateEnvironment,
  removeEnvironment,
  uploadServiceAccount
}) => (
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
                onEditClick={() => toggleDialogWithData(inst, i)}
                onRemoveClick={() => removeEnvironment(i)}
              />
            ))}
          </div>
        </div>
      ) : (
        <span>No Environments</span>
      )}
    </div>
    <AddEnvironmentDialog
      open={envDialogOpen}
      initialValues={selectedInstance}
      isEditing={!!selectedInstance}
      onFilesDrop={uploadServiceAccount}
      onSubmit={selectedInstance ? updateEnvironment : addEnvironment}
      onRequestClose={toggleDialog}
      selectedAccounts={selectedAccounts}
      onAccountClick={selectServiceAccount}
      serviceAccounts={serviceAccounts}
    />
  </div>
)

EnvironmentsPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  serviceAccounts: PropTypes.object, // from enhancer
  selectedAccounts: PropTypes.array, // from enhancer
  selectedInstance: PropTypes.object, // from enhancer
  toggleDialogWithData: PropTypes.func, // from enhancer
  addEnvironment: PropTypes.func, // from enhancer
  updateEnvironment: PropTypes.func, // from enhancer
  removeEnvironment: PropTypes.func, // from enhancer
  uploadServiceAccount: PropTypes.func, // from enhancer
  selectServiceAccount: PropTypes.func, // from enhancer
  toggleDialog: PropTypes.func, // from enhancer
  classes: PropTypes.object, // from enhancer (added by withStyles)
  envDialogOpen: PropTypes.bool
}

export default EnvironmentsPage
