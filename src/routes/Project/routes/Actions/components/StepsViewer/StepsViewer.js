import React from 'react'
import PropTypes from 'prop-types'
import Stepper, { Step, StepLabel, StepContent } from 'material-ui-next/Stepper'
import Typography from 'material-ui-next/Typography'
// import classes from './StepsViewer.scss'

export const StepsViewer = ({ steps, activeStep, disabled }) => (
  <div>
    <Stepper activeStep={activeStep} orientation="vertical" disabled={disabled}>
      {steps.map((step, index) => {
        return (
          <Step key={`Step-${index}`}>
            <StepLabel>{step.name || 'No Name'}</StepLabel>
            <StepContent>
              <Typography>Type: {step.type}</Typography>
              <Typography>{JSON.stringify(step)}</Typography>
            </StepContent>
          </Step>
        )
      })}
    </Stepper>
  </div>
)

StepsViewer.propTypes = {
  steps: PropTypes.array.isRequired,
  activeStep: PropTypes.number.isRequired,
  disabled: PropTypes.bool
}

export default StepsViewer
