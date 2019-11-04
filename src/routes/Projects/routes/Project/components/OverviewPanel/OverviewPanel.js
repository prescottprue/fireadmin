import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { paths } from 'constants/paths'
import styles from './OverviewPanel.styles'

const useStyles = makeStyles(styles)

function OverviewPanel({
  name,
  projectPath,
  environmentsEmpty,
  numberOfEnvironments
}) {
  const classes = useStyles()

  return (
    <Paper className={classes.root}>
      <Typography className={classes.name}>{name}</Typography>
      <Grid container spacing={8} justify="center" alignItems="stretch">
        <Grid item xs={12} md={6} className={classes.item}>
          <Typography variant="h6">Environments</Typography>
          {environmentsEmpty ? (
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
                {numberOfEnvironments}
              </Typography>
            </div>
          )}
          <Link to={`${projectPath}/${paths.projectEnvironments}`}>
            <Button variant="contained" color="primary">
              Go To Environments
            </Button>
          </Link>
        </Grid>
        <Grid item xs={12} md={6} className={classes.item}>
          <Typography variant="h6">Actions</Typography>
          <p className={classes.description}>
            Moving data is a nessesary part of any real world application.
            Actions allow you to move data in a repeatable way with complete
            logging of everything.
          </p>
          <Button
            variant="contained"
            color="primary"
            component={Link}
            to={`${projectPath}/${paths.projectActions}`}
            disabled={environmentsEmpty}>
            Go To Actions
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

OverviewPanel.propTypes = {
  name: PropTypes.string, // from enhancer (mapProps)
  projectPath: PropTypes.string, // from enhancer (mapProps)
  numberOfEnvironments: PropTypes.number, // from enhancer (mapProps)
  environmentsEmpty: PropTypes.bool.isRequired // from enhancer (mapProps)
}

export default OverviewPanel
