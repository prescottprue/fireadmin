import React from 'react'
import PropTypes from 'prop-types'
import DataViewerSetupForm from '../DataViewerSetupForm'

function DataViewerPage({ classes, projectId, getData }) {
  return (
    <div className={classes.container}>
      <DataViewerSetupForm projectId={projectId} onSubmit={getData} />
    </div>
  )
}

DataViewerPage.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  getData: PropTypes.func.isRequired, // from enhancer (withHandlers)
  projectId: PropTypes.string.isRequired // from react-router
}

export default DataViewerPage
