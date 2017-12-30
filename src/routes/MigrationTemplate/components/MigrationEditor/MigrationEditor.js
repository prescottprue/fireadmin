import React from 'react'
import PropTypes from 'prop-types'
import classes from './MigrationEditor.scss'

export const MigrationEditor = ({ setupEditor }) => (
  <div className={classes.container}>
    <div ref={setupEditor} style={{ width: '100%' }} />
  </div>
)

MigrationEditor.propTypes = {
  setupEditor: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default MigrationEditor
