import React from 'react'
import PropTypes from 'prop-types'
import MigrationMetaTile from '../MigrationMetaTile'

export const MigrationPage = props => (
  <div>
    <h2>Data Migration</h2>
    <div className="flex-row-center">
      <MigrationMetaTile {...props} />
    </div>
  </div>
)

MigrationPage.propTypes = {
  project: PropTypes.object,
  params: PropTypes.object,
  serviceAccounts: PropTypes.object
}

export default MigrationPage
