import React from 'react'
import PropTypes from 'prop-types'
import { get, map } from 'lodash'
import Button from '@material-ui/core/Button'
import { Field } from 'redux-form'
import { Link } from 'react-router-dom'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Grid from '@material-ui/core/Grid'
import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import { makeStyles } from '@material-ui/core/styles'
import CollectionSearch from 'components/CollectionSearch'
import TabContainer from 'components/TabContainer'
import { databaseURLToProjectName } from 'utils'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'
import OutlinedSelect from 'components/OutlinedSelect'
import ActionInput from '../ActionInput'
import StepsViewer from '../StepsViewer'
import PrivateActionTemplates from '../PrivateActionTemplates'
import styles from './ActionRunnerForm.styles'

const useStyles = makeStyles(styles)

function ActionRunnerForm({
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
  environments,
  environmentsExpanded,
  toggleEnvironments,
  selectTab,
  selectedTab
}) {
  const classes = useStyles()

  return (
    <div>
      <ExpansionPanel
        expanded={templateEditExpanded}
        onChange={toggleTemplateEdit}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.sectionHeader}>
            {templateName}
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className="flex-column">
          <Grid container spacing={8} justify="center">
            <Grid item xs={12} sm={8} md={8} style={{ textAlign: 'center' }}>
              <Typography paragraph>
                Run an action by selecting a template, filling in the template's
                configuation options, then clicking <strong>run action</strong>.
              </Typography>
              <Button
                color="primary"
                component={Link}
                to={ACTION_TEMPLATES_PATH}
                className={classes.button}>
                Create New Action Template
              </Button>
              <Typography className={classes.orFont}>
                or select existing
              </Typography>
            </Grid>
            <Grid item xs={12} md={8}>
              <AppBar position="static">
                <Tabs
                  value={selectedTab}
                  onChange={selectTab}
                  variant="fullWidth">
                  <Tab label="Public" />
                  <Tab label="Private" />
                </Tabs>
              </AppBar>
            </Grid>
            {selectedTab === 0 && (
              <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'center' }}>
                <TabContainer>
                  <div className={classes.search}>
                    <CollectionSearch
                      indexName="actionTemplates"
                      onSuggestionClick={selectActionTemplate}
                    />
                  </div>
                </TabContainer>
              </Grid>
            )}
            {selectedTab === 1 && (
              <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'center' }}>
                <TabContainer>
                  <PrivateActionTemplates
                    onTemplateClick={selectActionTemplate}
                  />
                </TabContainer>
              </Grid>
            )}
          </Grid>
        </ExpansionPanelDetails>
      </ExpansionPanel>
      {selectedTemplate ? (
        <ExpansionPanel
          expanded={environmentsExpanded}
          onChange={toggleEnvironments}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Environments</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.inputs}>
            <Grid container spacing={8}>
              {selectedTemplate.environments ? (
                selectedTemplate.environments.map((input, index) => (
                  <Grid item xs={10} md={6} key={`Environment-${index}`}>
                    <Field
                      name={`environmentValues.${index}`}
                      component={(props) => <OutlinedSelect {...props} />}
                      fullWidth
                      props={{
                        label: get(input, `name`) || `Environment ${index + 1}`
                      }}
                      inputProps={{
                        name: 'environment',
                        id: 'environment',
                        'data-test': 'environment-select'
                      }}>
                      {map(environments, (environment, envIndex) => (
                        <MenuItem
                          key={`Environment-Option-${environment.id}-${envIndex}`}
                          value={environment.id}
                          button
                          disabled={
                            environment.locked ||
                            (environment.readOnly && index === 1) ||
                            (environment.writeOnly && index === 0)
                          }
                          data-test={`environment-option-${environment.id}`}>
                          <ListItemText
                            primary={environment.name || environment.id}
                            secondary={`${databaseURLToProjectName(
                              environment.databaseURL
                            )}${environment.locked ? ' - Locked' : ''}${
                              environment.readOnly ? ' - Read Only' : ''
                            }${environment.writeOnly ? ' - Write Only' : ''}`}
                          />
                        </MenuItem>
                      ))}
                    </Field>
                  </Grid>
                ))
              ) : (
                <div className="flex-row-center">No Environments</div>
              )}
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ) : null}
      {selectedTemplate ? (
        <ExpansionPanel expanded={inputsExpanded} onChange={toggleInputs}>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Inputs</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails className={classes.inputs}>
            {selectedTemplate.inputs
              ? selectedTemplate.inputs.map((input, index) => (
                  <ActionInput
                    key={`Input-${index}`}
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
            <Grid container spacing={8} style={{ flexGrow: 1 }}>
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
}

ActionRunnerForm.propTypes = {
  project: PropTypes.object,
  selectTab: PropTypes.func.isRequired,
  selectedTab: PropTypes.number,
  templateName: PropTypes.string.isRequired,
  projectId: PropTypes.string.isRequired,
  toggleInputs: PropTypes.func.isRequired,
  toggleSteps: PropTypes.func.isRequired,
  selectActionTemplate: PropTypes.func.isRequired,
  toggleTemplateEdit: PropTypes.func.isRequired,
  inputsExpanded: PropTypes.bool.isRequired,
  environmentsExpanded: PropTypes.bool.isRequired,
  toggleEnvironments: PropTypes.func.isRequired,
  templateEditExpanded: PropTypes.bool.isRequired,
  stepsExpanded: PropTypes.bool.isRequired,
  selectedTemplate: PropTypes.object,
  environments: PropTypes.array
}

export default ActionRunnerForm
