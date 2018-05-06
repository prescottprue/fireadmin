import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Paper from 'material-ui/Paper'
import Instance from '../Instance'
import AddEnvironmentDialog from '../AddEnvironmentDialog'
import classesFromStyles from './EnvironmentsPage.scss'

export const EnvironmentsPage = ({
  project,
  params,
  toggleDialog,
  selectServiceAccount,
  selectedAccounts,
  selectedInstance,
  toggleDialogWithData,
  envDialogOpen,
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
      <Button variant="raised" color="primary" onTouchTap={toggleDialog}>
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
      open={envDialogOpen}
      projectId={params.projectId}
      initialValues={selectedInstance}
      isEditing={!!selectedInstance}
      onFilesDrop={uploadServiceAccount}
      onSubmit={selectedInstance ? updateEnvironment : addEnvironment}
      onRequestClose={toggleDialog}
      selectedAccounts={selectedAccounts}
      selectedServiceAccount={selectedServiceAccount}
      onAccountClick={selectServiceAccount}
    />
  </div>
)

EnvironmentsPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  selectedAccounts: PropTypes.array, // from enhancer
  selectedInstance: PropTypes.object, // from enhancer
  toggleDialogWithData: PropTypes.func, // from enhancer
  addEnvironment: PropTypes.func, // from enhancer
  updateEnvironment: PropTypes.func, // from enhancer
  removeEnvironment: PropTypes.func, // from enhancer
  uploadServiceAccount: PropTypes.func, // from enhancer
  selectServiceAccount: PropTypes.func, // from enhancer
  selectedServiceAccount: PropTypes.string, // from enhancer
  toggleDialog: PropTypes.func, // from enhancer
  envDialogOpen: PropTypes.bool
}

export default EnvironmentsPage
