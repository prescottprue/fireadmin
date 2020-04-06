import React from 'react'
import PropTypes from 'prop-types'
import { get } from 'lodash'
import Stepper from '@material-ui/core/Stepper'
import Step from '@material-ui/core/Step'
import StepLabel from '@material-ui/core/StepLabel'
import StepContent from '@material-ui/core/StepContent'
import Typography from '@material-ui/core/Typography'

function StepsViewer({ steps, activeStep, disabled, watch }) {
  const convertEnv = (step, name) => {
    const { pathType } = get(step, `${name}`, {})
    if (pathType === 'input') {
      const inputValues = watch('inputValues')
      return get(inputValues, get(step, `${name}.path`))
    }
    return get(step, `${name}.path`)
  }
  return (
    <Stepper activeStep={activeStep} orientation="vertical" disabled={disabled}>
      {steps.map((step, index) => {
        return (
          <Step key={`Step-${index}`}>
            <StepLabel>{step.name || 'No Name'}</StepLabel>
            <StepContent>
              <Typography>Type: {step.type}</Typography>
              <Typography>{step.description}</Typography>
              <Typography>Source: {convertEnv(step, 'src')}</Typography>
              <Typography>Destination: {convertEnv(step, 'dest')}</Typography>
            </StepContent>
          </Step>
        )
      })}
    </Stepper>
  )
}

StepsViewer.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
  convertEnv: PropTypes.func.isRequired,
  disabled: PropTypes.bool
}

export default StepsViewer
