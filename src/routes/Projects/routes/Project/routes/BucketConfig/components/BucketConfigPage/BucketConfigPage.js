import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import BucketConfigForm from '../BucketConfigForm'

function BucketConfigPage({ classes, project, projectId }) {
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
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  project: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired
}

export default BucketConfigPage
