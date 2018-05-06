import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui/Typography'
import BucketConfigForm from '../BucketConfigForm'
import classes from './BucketConfigPage.scss'

export const BucketConfigPage = ({ project, params }) => (
  <div className={classes.container}>
    <Typography className={classes.pageHeader}>
      Storage Bucket Configuration
    </Typography>
    <div className="flex-column-center">
      <BucketConfigForm project={project} projectId={params.projectId} />
    </div>
  </div>
)

BucketConfigPage.propTypes = {
  project: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired
}

export default BucketConfigPage
