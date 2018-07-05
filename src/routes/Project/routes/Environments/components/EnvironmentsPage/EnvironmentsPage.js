import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import EditEnvironmentDialog from '../EditEnvironmentDialog'
import DeleteEnvironmentDialog from '../DeleteEnvironmentDialog'
import classesFromStyles from './EnvironmentsPage.scss'

export const EnvironmentsPage = ({
  params,
  toggleNewDialog,
  toggleDeleteDialog,
  toggleEditDialog,
  selectServiceAccount,
  selectedInstance,
  projectEnvironments,
  newDialogOpen,
  deleteDialogOpen,
  editDialogOpen,
  addEnvironment,
  selectedServiceAccountInd,
  updateEnvironment,
  removeEnvironment
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
            {projectEnvironments.map((inst, i) => (
              <Instance
                key={`Instance-${inst.id}-${i}`}
                instance={inst}
                onEditClick={() => toggleEditDialog(inst, inst.id)}
                onRemoveClick={() => toggleDeleteDialog(inst.id)}
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
    <DeleteEnvironmentDialog
      open={deleteDialogOpen}
      projectId={params.projectId}
      onSubmit={removeEnvironment}
      onRequestClose={toggleDeleteDialog}
    />
    <AddEnvironmentDialog
      open={newDialogOpen}
      projectId={params.projectId}
      onSubmit={addEnvironment}
      onRequestClose={toggleNewDialog}
      selectedServiceAccount={selectedServiceAccountInd}
      onAccountClick={selectServiceAccount}
    />
    <EditEnvironmentDialog
      selectedInstance={selectedInstance}
      open={editDialogOpen}
      projectId={params.projectId}
      initialValues={selectedInstance}
      onSubmit={updateEnvironment}
      onRequestClose={toggleEditDialog}
      onAccountClick={selectServiceAccount}
    />
  </div>
)

EnvironmentsPage.propTypes = {
  projectEnvironments: PropTypes.array,
  params: PropTypes.object.isRequired,
  editDialogOpen: PropTypes.bool.isRequired,
  newDialogOpen: PropTypes.bool.isRequired,
  deleteDialogOpen: PropTypes.bool.isRequired,
  selectedInstance: PropTypes.object, // from enhancer
  selectedServiceAccountInd: PropTypes.number, // from enhancer
  addEnvironment: PropTypes.func.isRequired, // from enhancer (withHandlers)
  updateEnvironment: PropTypes.func.isRequired, // from enhancer (withHandlers)
  removeEnvironment: PropTypes.func.isRequired, // from enhancer  (withHandlers)
  toggleDeleteDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleNewDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleEditDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  selectServiceAccount: PropTypes.func.isRequired // from enhancer (withStateHandlers)
}

export default EnvironmentsPage
