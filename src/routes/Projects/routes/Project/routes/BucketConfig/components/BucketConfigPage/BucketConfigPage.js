import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import BucketConfigForm from '../BucketConfigForm'
import styles from './BucketConfigPage.styles'

const useStyles = makeStyles(styles)

function BucketConfigPage({ project, projectId }) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography className={classes.pageHeader}>
        Storage Bucket Configuration
      </Typography>
      <div className="flex-column-center">
        <BucketConfigForm project={project} projectId={projectId} />
      </div>
    </div>
  )
}

BucketConfigPage.propTypes = {
  project: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired
}

export default BucketConfigPage
