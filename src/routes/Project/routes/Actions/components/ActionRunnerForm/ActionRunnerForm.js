import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Button from 'material-ui/Button'
import { Link } from 'react-router'
import ExpandMoreIcon from 'material-ui-icons/ExpandMore'
import Grid from 'material-ui/Grid'
import CollectionSearch from 'components/CollectionSearch'
import Typography from 'material-ui/Typography'
import ExpansionPanel, {
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from 'material-ui/ExpansionPanel'
import { paths } from 'constants'
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
  templateName,
  toggleTemplateEdit,
  selectActionTemplate,
  templateEditExpanded,
  project,
  environments
}) => (
  <div className={classes.container}>
    <ExpansionPanel
      expanded={templateEditExpanded}
      onChange={toggleTemplateEdit}
      className={classes.panel}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.sectionHeader}>
          {templateName}
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails className="flex-column">
        <Typography paragraph>
          Run a data action by selecting a template, filling in the template's
          configuation options, then clicking run action
        </Typography>
        <div className="flex-row-center">
          <Link to={paths.actionTemplates}>
            <Button color="primary" className={classes.button}>
              Create New Action Template
            </Button>
          </Link>
        </div>
        <div className={classes.or}>
          <Typography className={classes.orFont}>or</Typography>
        </div>
        <div className={classes.search}>
          <CollectionSearch
            indexName="actionTemplates"
            onSuggestionClick={selectActionTemplate}
          />
        </div>
      </ExpansionPanelDetails>
    </ExpansionPanel>
    {selectedTemplate ? (
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
    ) : null}
    {selectedTemplate ? (
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
    ) : null}
  </div>
)

ActionRunnerForm.propTypes = {
  project: PropTypes.object,
  templateName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  toggleInputs: PropTypes.func.isRequired,
  toggleSteps: PropTypes.func.isRequired,
  selectActionTemplate: PropTypes.func.isRequired,
  toggleTemplateEdit: PropTypes.func.isRequired,
  inputsExpanded: PropTypes.bool.isRequired,
  templateEditExpanded: PropTypes.bool.isRequired,
  stepsExpanded: PropTypes.bool.isRequired,
  selectedTemplate: PropTypes.object,
  environments: PropTypes.object
}

export default ActionRunnerForm
