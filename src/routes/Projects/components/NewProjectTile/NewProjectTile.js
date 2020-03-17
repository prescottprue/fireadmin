import React from 'react'
import PropTypes from 'prop-types'
import ContentAddCircle from '@material-ui/icons/AddCircle'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import styles from './NewProjectTile.styles'

const iconSize = '6rem'
const iconStyle = { width: iconSize, height: iconSize }
const useStyles = makeStyles(styles)

function NewProjectTile({ onClick }) {
  const classes = useStyles()

  return (
    <Paper
      className={classes.root}
      onClick={onClick}
      data-test="new-project-tile">
      <ContentAddCircle style={iconStyle} />
    </Paper>
  )
}

NewProjectTile.propTypes = {
  onClick: PropTypes.func.isRequired
}

export default NewProjectTile
