import React from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.flexColumnCenter
  }
}))

function ProjectNotFoundPage() {
  const classes = useStyles()
  return <div className={classes.container}>Project Not Found</div>
}

export default ProjectNotFoundPage
