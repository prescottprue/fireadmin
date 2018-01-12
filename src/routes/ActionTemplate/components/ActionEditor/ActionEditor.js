import React from 'react'
import PropTypes from 'prop-types'
import classes from './ActionEditor.scss'

export const ActionEditor = ({ setupEditor }) => (
  <div className={classes.container}>
    <div ref={setupEditor} style={{ width: '100%' }} />
  </div>
)

ActionEditor.propTypes = {
  setupEditor: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default ActionEditor
