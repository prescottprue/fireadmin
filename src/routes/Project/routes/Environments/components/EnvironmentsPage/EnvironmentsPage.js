import React from 'react'
import PropTypes from 'prop-types'
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
  selectedInstance,
  projectEnvironments,
  newDialogOpen,
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
                key={`Instance-${params.projectId}-${i}`}
                instance={inst}
                onEditClick={() => toggleEditDialog(inst, inst.id)}
                onRemoveClick={() => removeEnvironment(inst.id)}
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
  editDialogOpen: PropTypes.bool,
  newDialogOpen: PropTypes.bool,
  selectedInstance: PropTypes.object, // from enhancer
  selectedServiceAccountInd: PropTypes.number, // from enhancer
  addEnvironment: PropTypes.func.isRequired, // from enhancer (withHandlers)
  updateEnvironment: PropTypes.func.isRequired, // from enhancer (withHandlers)
  removeEnvironment: PropTypes.func.isRequired, // from enhancer  (withHandlers)
  toggleNewDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleEditDialog: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  selectServiceAccount: PropTypes.func.isRequired // from enhancer (withStateHandlers)
}

export default EnvironmentsPage
