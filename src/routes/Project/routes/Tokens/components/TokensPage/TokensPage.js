import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CopyIcon from '@material-ui/icons/FileCopy'
import { Grid } from '@material-ui/core'

function TokensPage({ generateToken, classes, copyToken, token }) {
  return (
    <div>
      <Typography className={classes.pageHeader}>Tokens</Typography>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          aria-label="Add Member"
          onClick={generateToken}>
          Generate Token
        </Button>
      </div>
      {token ? (
        <Paper>
          <Grid container spacing={2}>
            <Grid item xs={7}>
              <Typography component="p">{token}</Typography>
            </Grid>
            <Grid item xs={4}>
              <IconButton
                aria-label="Copy Token"
                color="inherit"
                onClick={copyToken}>
                <CopyIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ) : null}
    </div>
  )
}

TokensPage.propTypes = {
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired
  }),
  generateToken: PropTypes.func.isRequired,
  copyToken: PropTypes.func.isRequired,
  token: PropTypes.string, // from enhancer (withStateHandlers)
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TokensPage
