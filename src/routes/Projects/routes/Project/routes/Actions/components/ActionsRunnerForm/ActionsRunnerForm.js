import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { get, map } from 'lodash'
import { useForm, Controller } from 'react-hook-form'
import { useFirestore, useFirestoreCollectionData } from 'reactfire'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import TextField from '@material-ui/core/TextField'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import { makeStyles } from '@material-ui/core/styles'
import { databaseURLToProjectName } from 'utils'
import { PROJECTS_COLLECTION } from 'constants/firebasePaths'
import StepsViewer from '../StepsViewer'
import styles from './ActionsRunnerForm.styles'

const useStyles = makeStyles(styles)

function ActionsRunnerForm({
  projectId,
  runAction,
  selectedTemplate,
  changeTemplateEdit,
  changeSelectedTemplate
}) {
  const classes = useStyles()

  const [inputsExpanded, changeInputExpanded] = useState(true)
  const [environmentsExpanded, changeEnvironmentsExpanded] = useState(true)
  const firestore = useFirestore()
  const environmentsRef = firestore.collection(
    `${PROJECTS_COLLECTION}/${projectId}/environments`
  )
  const environments = useFirestoreCollectionData(environmentsRef, {
    idField: 'id'
  })
  async function runActionAndClose(actionInfo) {
    await runAction(actionInfo)
    changeEnvironmentsExpanded(false)
    changeInputExpanded(false)
  }

  const toggleEnvironments = () =>
    changeEnvironmentsExpanded(!environmentsExpanded)
  const toggleInputs = () => changeInputExpanded(!inputsExpanded)
  const clearRunner = () => {
    reset()
    changeSelectedTemplate(null)
    changeTemplateEdit(true)
  }
  const { register, watch, control, handleSubmit, reset } = useForm({
    defaultValues: selectedTemplate
  })
  // TODO: Disable run action button if form is not fully filled out
  return (
    <form onSubmit={handleSubmit(runActionAndClose)} className={classes.root}>
      <Accordion expanded={environmentsExpanded} onChange={toggleEnvironments}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Environments</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.inputs}>
          <Grid container spacing={8}>
            {selectedTemplate.environments ? (
              selectedTemplate.environments.map((input, index) => (
                <Grid item xs={10} md={6} key={`Environment-${index}`}>
                  <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">
                      {input?.name || `Environment ${index + 1}`}
                    </InputLabel>
                    <Controller
                      as={
                        <Select fullWidth data-test="environment-select">
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
                                  environment && environment.databaseURL
                                )}${environment.locked ? ' - Locked' : ''}${
                                  environment.readOnly ? ' - Read Only' : ''
                                }${
                                  environment.writeOnly ? ' - Write Only' : ''
                                }`}
                              />
                            </MenuItem>
                          ))}
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
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={inputsExpanded} onChange={toggleInputs}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Inputs</Typography>
        </AccordionSummary>
        <AccordionDetails className={classes.inputs}>
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
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={classes.heading}>Steps</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={8} style={{ flexGrow: 1 }}>
            <Grid item xs={12} lg={6}>
              {selectedTemplate?.steps ? (
                <StepsViewer
                  steps={selectedTemplate.steps}
                  activeStep={0}
                  watch={watch}
                />
              ) : null}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      <div className={classes.buttons}>
        <Button
          color="secondary"
          variant="contained"
          aria-label="Clear"
          onClick={clearRunner}
          className={classes.button}
          data-test="clear-action-button">
          Clear
        </Button>
        <Button
          disabled={!selectedTemplate}
          color="primary"
          variant="contained"
          aria-label="Run Action"
          type="submit"
          data-test="run-action-button"
          className={classes.button}>
          Run Action
        </Button>
      </div>
    </form>
  )
}

ActionsRunnerForm.propTypes = {
  projectId: PropTypes.string.isRequired,
  runAction: PropTypes.func.isRequired,
  changeTemplateEdit: PropTypes.func.isRequired,
  changeSelectedTemplate: PropTypes.func.isRequired,
  selectedTemplate: PropTypes.object.isRequired
}

export default ActionsRunnerForm
