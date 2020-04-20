import React, { useState } from 'react'
import { get, map } from 'lodash'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import Button from '@material-ui/core/Button'
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
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import CollectionSearch from 'components/CollectionSearch'
import TabContainer from 'components/TabContainer'
import { databaseURLToProjectName } from 'utils'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'
import StepsViewer from '../StepsViewer'
import PrivateActionTemplates from '../PrivateActionTemplates'
import RecentActions from '../RecentActions'
import styles from './ActionPage.styles'
import useActionsPage from './useActionsPage'

const useStyles = makeStyles(styles)

function ActionsPage({ projectId }) {
  const classes = useStyles()
  const { reset, register, watch, control, handleSubmit } = useForm()
  const [selectedTab, selectTab] = useState(0)
  const lockedEnvInUse = false // TODO: Load this from Firestore data
  const [selectedTemplate, changeSelectedTemplate] = useState()
  const [templateEditExpanded, changeTemplateEdit] = useState(true)
  const [inputsExpanded, changeInputExpanded] = useState(true)
  const [environmentsExpanded, changeEnvironmentsExpanded] = useState(true)
  const firestore = useFirestore()
  const environmentsRef = firestore.collection(
    `projects/${projectId}/environments`
  )
  const environments = useFirestoreCollectionData(environmentsRef, {
    idField: 'id'
  })
  console.log('environments', environments)
  const toggleTemplateEdit = () => changeTemplateEdit(!templateEditExpanded)
  const toggleEnvironments = () =>
    changeEnvironmentsExpanded(!environmentsExpanded)
  const toggleInputs = () => changeInputExpanded(!inputsExpanded)
  const selectActionTemplate = (newSelectedTemplate) => {
    changeSelectedTemplate(newSelectedTemplate)
    changeTemplateEdit(false)
    changeInputExpanded(true)
    changeEnvironmentsExpanded(true)
  }
  const closeRunnerSections = () => {
    changeInputExpanded(false)
    changeEnvironmentsExpanded(false)
  }
  const { runAction, rerunAction } = useActionsPage({
    projectId,
    watch,
    closeRunnerSections,
    selectActionTemplate,
    selectedTemplate
  })
  const templateName = selectedTemplate
    ? `Template: ${get(selectedTemplate, 'name', '')}`
    : 'Template'

  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>Actions</Typography>
      <Typography variant="h5">Action Runner</Typography>
      <div className={classes.container}>
        <div className={classes.buttons}>
          <Button
            disabled={!selectedTemplate || lockedEnvInUse}
            color="primary"
            variant="contained"
            aria-label="Run Action"
            onClick={handleSubmit(runAction)}
            data-test="run-action-button">
            Run Action
          </Button>
          {selectedTemplate && (
            <Button
              color="secondary"
              variant="contained"
              aria-label="Clear"
              onClick={reset}
              className={classes.button}
              data-test="clear-action-button">
              Clear
            </Button>
          )}
        </div>
        <div>
          <ExpansionPanel
            expanded={templateEditExpanded}
            onChange={toggleTemplateEdit}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.sectionHeader}>
                {templateName}
              </Typography>
            </ExpansionPanelSummary>
            <TabContainer className="flex-column">
              <Grid container spacing={8} justify="center">
                <Grid
                  item
                  xs={12}
                  sm={8}
                  md={8}
                  style={{ textAlign: 'center' }}>
                  <Typography paragraph>
                    Run an action by selecting a template, filling in the
                    template's configuration options, then clicking{' '}
                    <strong>run action</strong>.
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
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ textAlign: 'center' }}>
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
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    style={{ textAlign: 'center' }}>
                    <TabContainer>
                      <PrivateActionTemplates
                        onTemplateClick={selectActionTemplate}
                      />
                    </TabContainer>
                  </Grid>
                )}
              </Grid>
            </TabContainer>
          </ExpansionPanel>
          <form onSubmit={handleSubmit(runAction)}>
            {selectedTemplate ? (
              <ExpansionPanel
                expanded={environmentsExpanded}
                onChange={toggleEnvironments}>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className={classes.heading}>
                    Environments
                  </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.inputs}>
                  <Grid container spacing={8}>
                    {selectedTemplate.environments ? (
                      selectedTemplate.environments.map((input, index) => (
                        <Grid item xs={10} md={6} key={`Environment-${index}`}>
                          <FormControl variant="outlined" fullWidth>
                            <InputLabel id="demo-simple-select-outlined-label">
                              {(input && input.name) ||
                                `Environment ${index + 1}`}
                            </InputLabel>
                            <Controller
                              as={
                                <Select
                                  fullWidth
                                  data-test="environment-select">
                                  {map(
                                    environments,
                                    (environment, envIndex) => (
                                      <MenuItem
                                        key={`Environment-Option-${environment.id}-${envIndex}`}
                                        value={environment.id}
                                        button
                                        disabled={
                                          environment.locked ||
                                          (environment.readOnly &&
                                            index === 1) ||
                                          (environment.writeOnly && index === 0)
                                        }
                                        data-test={`environment-option-${environment.id}`}>
                                        <ListItemText
                                          primary={
                                            environment.name || environment.id
                                          }
                                          secondary={`${databaseURLToProjectName(
                                            environment &&
                                              environment.databaseURL
                                          )}${
                                            environment.locked
                                              ? ' - Locked'
                                              : ''
                                          }${
                                            environment.readOnly
                                              ? ' - Read Only'
                                              : ''
                                          }${
                                            environment.writeOnly
                                              ? ' - Write Only'
                                              : ''
                                          }`}
                                        />
                                      </MenuItem>
                                    )
                                  )}
                                </Select>
                              }
                              name={`environmentValues.${index}`}
                              defaultValue=""
                              control={control}
                            />
                          </FormControl>
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
                        <TextField
                          key={`Input-${index}`}
                          name={`inputValues.${index}`}
                          label={
                            get(selectedTemplate.inputs, `${index}.name`) ||
                            `Input ${index + 1}`
                          }
                          margin="normal"
                          inputRef={register}
                          fullWidth
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
                        <StepsViewer
                          steps={selectedTemplate.steps}
                          activeStep={0}
                          watch={watch}
                        />
                      ) : null}
                    </Grid>
                  </Grid>
                </ExpansionPanelDetails>
              </ExpansionPanel>
            ) : null}
          </form>
        </div>
      </div>
      <Typography variant="h5">Recently Run Actions</Typography>
      <RecentActions projectId={projectId} rerunAction={rerunAction} />
    </div>
  )
}

export default ActionsPage
