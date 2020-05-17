import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import {
  LIST_PATH,
  PROJECT_ENVIRONMENTS_PATH,
  PROJECT_ACTION_PATH
} from 'constants/paths'
import styles from './OverviewPanel.styles'
import { useFirestoreCollectionData, useFirestore } from 'reactfire'

const useStyles = makeStyles(styles)

function OverviewPanel({ project, projectId }) {
  const classes = useStyles()
  const projectPath = `${LIST_PATH}/${projectId}`
  const firestore = useFirestore()
  const projectEnvironmentsRef = firestore.collection(
    `projects/${projectId}/environments`
  )
  const projectEnvironments = useFirestoreCollectionData(projectEnvironmentsRef)

  return (
    <Paper className={classes.root}>
      <Typography className={classes.name}>{project.name}</Typography>
      <Grid container spacing={8} justify="center" alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.item}>
          <Typography variant="h6">Environments</Typography>
          {!projectEnvironments.length ? (
            <p className={classes.description}>
              Managing different phases of a project is simplified by creating
              "Environments". Bigger projects commonly run a production
              environment along with multiple staging and development
              environments.
            </p>
          ) : (
            <div className={classes.environments}>
              <Typography className={classes.environmentsLabel}>
                Current Environments:
              </Typography>
              <Typography className={classes.environmentsNumber}>
                {projectEnvironments.length}
              </Typography>
            </div>
          )}
          <Link to={`${projectPath}/${PROJECT_ENVIRONMENTS_PATH}`}>
            <Button variant="contained" color="primary">
              Go To Environments
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={6} className={classes.item}>
          <Typography variant="h6">Actions</Typography>
          <p className={classes.description}>
            Moving data is a necessary part of any real world application.
            Actions allow you to move data in a repeatable way with complete
            logging of everything.
          </p>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`${projectPath}/${PROJECT_ACTION_PATH}`}
            disabled={!projectEnvironments.length}>
            Go To Actions
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

OverviewPanel.propTypes = {
  project: PropTypes.object.isRequired,
  projectId: PropTypes.string.isRequired
}

export default OverviewPanel
