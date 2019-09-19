import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import ActionRunnerForm from '../ActionRunnerForm'
import RecentActions from '../RecentActions'

function ActionsPage({
  classes,
  selectActionTemplate,
  runAction,
  runActionDisabled,
  clearRunner,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
  templateName,
  submitActionRunner,
  projectId,
  inputsExpanded,
  toggleInputs,
  environmentsExpanded,
  toggleEnvironments,
  stepsExpanded,
  toggleSteps,
  rerunAction
}) {
  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Actions</Typography>
      <Typography variant="h5">Action Runner</Typography>
      <div className={classes.container}>
        <div className={classes.buttons}>
          <Button
            disabled={runActionDisabled}
            color="primary"
            variant="contained"
            aria-label="Run Action"
            onClick={submitActionRunner}
            data-test="run-action-button">
            Run Action
          </Button>
          {selectedTemplate && (
            <Button
              color="secondary"
              variant="contained"
              aria-label="Clear"
              onClick={clearRunner}
              className={classes.button}
              data-test="clear-action-button">
              Clear
            </Button>
          )}
        </div>
        <ActionRunnerForm
          projectId={projectId}
          selectedTemplate={selectedTemplate}
          initialValues={selectedTemplate}
          templateName={templateName}
          templateEditExpanded={templateEditExpanded}
          toggleTemplateEdit={toggleTemplateEdit}
          inputsExpanded={inputsExpanded}
          toggleInputs={toggleInputs}
          environmentsExpanded={environmentsExpanded}
          toggleEnvironments={toggleEnvironments}
          stepsExpanded={stepsExpanded}
          toggleSteps={toggleSteps}
          selectActionTemplate={selectActionTemplate}
          onSubmit={runAction}
        />
      </div>
      <Typography variant="h5">Recently Run Actions</Typography>
      <RecentActions projectId={projectId} rerunAction={rerunAction} />
    </div>
  )
}

ActionsPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  projectId: PropTypes.string.isRequired, // from enhancer (connect)
  selectedTemplate: PropTypes.object, // from enhancer (withStateHandlers)
  runAction: PropTypes.func.isRequired, // from enhancer (withHandlers)
  rerunAction: PropTypes.func.isRequired, // from enhancer (withHandlers)
  submitActionRunner: PropTypes.func.isRequired, // from enhancer (withHandlers)
  clearRunner: PropTypes.func.isRequired, // from enhancer (withHandlers)
  selectActionTemplate: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  toggleTemplateEdit: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  inputsExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  toggleInputs: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  environmentsExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  toggleEnvironments: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  templateEditExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  stepsExpanded: PropTypes.bool.isRequired, // from enhancer (withStateHandlers)
  toggleSteps: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  runActionDisabled: PropTypes.bool.isRequired, // from enhancer (withProps)
  templateName: PropTypes.string.isRequired // from enhancer (withProps)
}

export default ActionsPage
