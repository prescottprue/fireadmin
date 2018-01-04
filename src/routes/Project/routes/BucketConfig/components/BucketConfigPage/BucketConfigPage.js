import React from 'react'
import PropTypes from 'prop-types'
import Typography from 'material-ui-next/Typography'
import BucketConfigForm from '../BucketConfigForm'
import classes from './BucketConfigPage.scss'

export const BucketConfigPage = ({ serviceAccounts, project }) => (
  <div>
    <Typography className={classes.pageHeader}>
      Storage Bucket Configuration
    </Typography>
    <div className="flex-column-center">
      <Typography className={classes.subHeader}>CORS Configuration</Typography>
      <BucketConfigForm serviceAccounts={serviceAccounts} project={project} />
    </div>
  </div>
)

BucketConfigPage.propTypes = {
  serviceAccounts: PropTypes.object,
  project: PropTypes.object
}

export default BucketConfigPage
