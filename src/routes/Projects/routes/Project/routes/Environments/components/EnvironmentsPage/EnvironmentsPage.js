import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import EditEnvironmentDialog from '../EditEnvironmentDialog'
import DeleteEnvironmentDialog from '../DeleteEnvironmentDialog'
import styles from './EnvironmentsPage.styles'
import useEnvironmentsPage from './useEnvironmentsPage'

const useStyles = makeStyles(styles)

function EnvironmentsPage({ projectId }) {
  const classes = useStyles()
  const {
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
    selectedServiceAccount,
    updateEnvironment,
    removeEnvironment
  } = useEnvironmentsPage({ projectId })

  return (
    <div>
      <Typography className={classes.pageHeader}>Environments</Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={toggleNewDialog}
        style={{ marginBottom: '2rem' }}
        data-test="add-environment-button">
        Add Environment
      </Button>
      <div>
        {projectEnvironments && projectEnvironments.length ? (
          <div className="flex-column">
            <div className={classes.instances}>
              {projectEnvironments.map((inst, i) => (
                <Instance
                  key={`Instance-${inst.id}-${i}`}
                  instance={inst}
                  instanceId={inst.id}
                  onEditClick={() => toggleEditDialog(inst, inst.id)}
                  onRemoveClick={() => toggleDeleteDialog(inst.id)}
                  data-test="environment-tile"
                />
              ))}
            </div>
          </div>
        ) : (
          <Paper className={classes.paper} data-test="no-environments-message">
            <Typography className={classes.paragraph}>
              An environment is a Firebase project for a specific phase of your
              project (such as "development" or "production"). Multiple
              environments allow for testing code in a "sandbox" before
              releasing it to the world. Most Real World Production applications
              leverage many environment.
            </Typography>
            <Typography className={classes.paragraph}>
              Create an environment within your project by clicking the "Add
              Environment" button above
            </Typography>
          </Paper>
        )}
      </div>
      <DeleteEnvironmentDialog
        open={deleteDialogOpen}
        projectId={projectId}
        onSubmit={removeEnvironment}
        onRequestClose={toggleDeleteDialog}
      />
      <AddEnvironmentDialog
        open={newDialogOpen}
        projectId={projectId}
        onSubmit={addEnvironment}
        onRequestClose={toggleNewDialog}
        selectedServiceAccount={selectedServiceAccount}
        onAccountClick={selectServiceAccount}
      />
      <EditEnvironmentDialog
        selectedInstance={selectedInstance}
        open={editDialogOpen}
        projectId={projectId}
        initialValues={selectedInstance}
        onSubmit={updateEnvironment}
        onRequestClose={toggleEditDialog}
        onAccountClick={selectServiceAccount}
      />
    </div>
  )
}

EnvironmentsPage.propTypes = {
  projectId: PropTypes.string.isRequired
}

export default EnvironmentsPage
