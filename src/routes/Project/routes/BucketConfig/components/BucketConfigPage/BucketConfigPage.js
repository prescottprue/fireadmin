import React from 'react'
import PropTypes from 'prop-types'
import BucketConfigForm from '../BucketConfigForm'

export const BucketConfigPage = ({ updateBucketConfig }) => (
  <div>
    <h2>Storage Bucket Configuration</h2>
    <div className="flex-column-center">
      <BucketConfigForm onSubmit={updateBucketConfig} />
    </div>
  </div>
)

BucketConfigPage.propTypes = {
  updateBucketConfig: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default BucketConfigPage
