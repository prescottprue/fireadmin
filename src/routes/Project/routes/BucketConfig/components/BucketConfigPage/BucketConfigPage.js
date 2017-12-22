import React from 'react'
import Button from 'material-ui-next/Button'
// import PropTypes from 'prop-types'

export const BucketConfigPage = props => (
  <div>
    <h2>Bucket Config</h2>
    <div className="flex-column-center">
      Here is where we will set config
      <div className="flex-row-center">
        <Button raised color="primary">
          Get Bucket Config
        </Button>
        <Button raised color="primary">
          Set Bucket Config
        </Button>
      </div>
      <pre>origin: "http://somedomain.com"</pre>
    </div>
  </div>
)

// BucketConfigPage.propTypes = {
//
// }

export default BucketConfigPage
