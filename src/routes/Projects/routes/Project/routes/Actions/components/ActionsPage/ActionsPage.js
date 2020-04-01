import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import ActionRunnerForm from '../ActionRunnerForm'
import RecentActions from '../RecentActions'
import styles from './ActionPage.styles'

const useStyles = makeStyles(styles)

function ActionsPage({
  selectActionTemplate,
  runAction,
  lockedEnvInUse,
  clearRunner,
  selectedTemplate,
  toggleTemplateEdit,
  templateEditExpanded,
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
  const classes = useStyles()
  const templateName = selectedTemplate
    ? `Template: ${get(selectedTemplate, 'name', '')}`
    : 'Template'
  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Actions</Typography>
      <Typography variant="h5">Action Runner</Typography>
      <div className={classes.container}>
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
  projectId: PropTypes.string.isRequired, // from enhancer (connect)
  lockedEnvInUse: PropTypes.bool.isRequired, // from enhancer (connect)
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
  toggleSteps: PropTypes.func.isRequired // from enhancer (withStateHandlers)
}

export default ActionsPage
