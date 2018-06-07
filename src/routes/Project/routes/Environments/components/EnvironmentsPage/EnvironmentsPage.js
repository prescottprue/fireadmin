import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import EditEnvironmentDialog from '../EditEnvironmentDialog'
import classesFromStyles from './EnvironmentsPage.scss'

export const EnvironmentsPage = ({
  params,
  toggleNewDialog,
  toggleEditDialog,
  selectServiceAccount,
  selectedAccounts,
  selectedInstance,
  projectEnvironments,
  newDialogOpen,
  editDialogOpen,
  addEnvironment,
  selectedServiceAccount,
  updateEnvironment,
  removeEnvironment,
  uploadServiceAccount
}) => (
  <div>
    <Typography className={classesFromStyles.pageHeader}>
      Environments
    </Typography>
    <div style={{ marginBottom: '2rem' }}>
      <Button variant="raised" color="primary" onClick={toggleNewDialog}>
        Add Environment
      </Button>
    </div>
    <div>
      {projectEnvironments && projectEnvironments.length ? (
        <div className="flex-column">
          <div className={classesFromStyles.instances}>
            {map(projectEnvironments, (inst, i) => (
              <Instance
                key={`Instance-${params.projectId}-${i}`}
                instance={inst}
                onEditClick={() => toggleEditDialog(inst, i)}
                onRemoveClick={() => removeEnvironment(i)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Paper className={classesFromStyles.paper}>
          <Typography className={classesFromStyles.paragraph}>
            An environment is a Firebase project for a specific phase of your
            project (such as "development" or "production"). Multiple
            environments allow for testing code in a "sandbox" before releasing
            it to the world. Most Real World Production applications leverage
            many environment.
          </Typography>
          <Typography className={classesFromStyles.paragraph}>
            Create an environment within your project by clicking the "Add
            Environment" button above
          </Typography>
        </Paper>
      )}
    </div>
    <AddEnvironmentDialog
      selectedInstance={selectedInstance}
      open={newDialogOpen}
      projectId={params.projectId}
      initialValues={selectedInstance}
      isEditing={!!selectedInstance}
      onSubmit={addEnvironment}
      onRequestClose={toggleNewDialog}
      selectedAccounts={selectedAccounts}
      selectedServiceAccount={selectedServiceAccount}
      onAccountClick={selectServiceAccount}
    />
    <EditEnvironmentDialog
      selectedInstance={selectedInstance}
      open={editDialogOpen}
      projectId={params.projectId}
      initialValues={selectedInstance}
      isEditing={!!selectedInstance}
      onSubmit={addEnvironment}
      onRequestClose={toggleEditDialog}
      selectedAccounts={selectedAccounts}
      selectedServiceAccount={selectedServiceAccount}
      onAccountClick={selectServiceAccount}
    />
  </div>
)

EnvironmentsPage.propTypes = {
  projectEnvironments: PropTypes.array,
  params: PropTypes.object.isRequired,
  editDialogOpen: PropTypes.bool,
  newDialogOpen: PropTypes.bool,
  selectedAccounts: PropTypes.array, // from enhancer
  selectedInstance: PropTypes.object, // from enhancer
  selectedServiceAccount: PropTypes.string, // from enhancer
  toggleNewDialog: PropTypes.func.isRequired, // from enhancer
  toggleEditDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  addEnvironment: PropTypes.func.isRequired, // from enhancer
  updateEnvironment: PropTypes.func.isRequired, // from enhancer
  removeEnvironment: PropTypes.func.isRequired, // from enhancer
  uploadServiceAccount: PropTypes.func.isRequired, // from enhancer
  selectServiceAccount: PropTypes.func.isRequired // from enhancer
}

export default EnvironmentsPage
