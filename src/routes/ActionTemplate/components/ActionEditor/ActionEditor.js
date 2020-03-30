import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  lineHeight: '22.4px',
  fontFamily: 'Roboto Mono',
  fontSize: '16px',
  height: '100%',
  marginTop: '2rem',
  width: '80vw'
}))

function ActionEditor({ setupEditor }) {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <div ref={setupEditor} style={{ width: '100%' }} />
    </div>
  )
}

ActionEditor.propTypes = {
  setupEditor: PropTypes.func.isRequired // from enhancer (withHandlers)
}

export default ActionEditor
