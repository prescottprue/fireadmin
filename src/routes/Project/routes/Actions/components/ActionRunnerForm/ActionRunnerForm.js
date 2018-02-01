import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Grid from 'material-ui-next/Grid'
import Typography from 'material-ui-next/Typography'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui-next/ExpansionPanel'
import ActionInput from '../ActionInput'
import StepsViewer from '../StepsViewer'
import classes from './ActionRunnerForm.scss'

export const ActionRunnerForm = ({
  selectedTemplate,
  inputsExpanded,
  toggleSteps,
  stepsExpanded,
  projectId,
  toggleInputs,
  project,
  environments
}) => (
  <div className={classes.container}>
    <ExpansionPanel expanded={inputsExpanded} onChange={toggleInputs}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Inputs</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className={classes.inputs}>
        {selectedTemplate && selectedTemplate.inputs
          ? selectedTemplate.inputs.map((input, index) => (
              <ActionInput
                key={index}
                name={`inputValues.${index}`}
                inputs={selectedTemplate.inputs}
                inputMeta={get(selectedTemplate.inputs, index)}
                {...{ index, environments, projectId }}
              />
            ))
          : null}
      </ExpansionPanelDetails>
    </ExpansionPanel>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.heading}>Steps</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container spacing={24} style={{ flexGrow: 1 }}>
          <Grid item xs={12} lg={6}>
            {selectedTemplate && selectedTemplate.steps ? (
              <StepsViewer steps={selectedTemplate.steps} activeStep={0} />
            ) : null}
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  </div>
)

ActionRunnerForm.propTypes = {
  project: PropTypes.object,
  projectId: PropTypes.string.isRequired,
  toggleInputs: PropTypes.func.isRequired,
  toggleSteps: PropTypes.func.isRequired,
  inputsExpanded: PropTypes.bool.isRequired,
  stepsExpanded: PropTypes.bool.isRequired,
  selectedTemplate: PropTypes.object,
  environments: PropTypes.object
}

export default ActionRunnerForm
