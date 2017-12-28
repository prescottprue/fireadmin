import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import Typography from 'material-ui-next/Typography'
import IconButton from 'material-ui-next/IconButton'
import Tooltip from 'material-ui-next/Tooltip'
import MigrationTemplateForm from '../MigrationTemplateForm'
import BackIcon from 'material-ui-icons/ArrowBack'
import { paths } from 'constants'
import classes from './MigrationTemplatePage.scss'

export const MigrationTemplatePage = ({ template, updateTemplate }) => (
  <div className={classes.container}>
    <Typography className={classes.header}>Migration Template</Typography>
    <Link to={paths.dataMigration}>
      <Tooltip placement="bottom" title="Back To Templates">
        <IconButton className={classes.submit}>
          <BackIcon />
        </IconButton>
      </Tooltip>
    </Link>
    <MigrationTemplateForm onSubmit={updateTemplate} initialValues={template} />
  </div>
)

MigrationTemplatePage.propTypes = {
  template: PropTypes.object,
  updateTemplate: PropTypes.func
}

export default MigrationTemplatePage
