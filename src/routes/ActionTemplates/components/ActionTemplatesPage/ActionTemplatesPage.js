import React from 'react'
// import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import ActionTemplatesList from '../ActionTemplatesList'
import classes from './ActionTemplatesPage.scss'

export const ActionTemplatesPage = () => (
  <div className={classes.container}>
    <Typography className={classes.header}>Action Templates</Typography>
    <ActionTemplatesList />
  </div>
)

export default ActionTemplatesPage
