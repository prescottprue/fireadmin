import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CopyIcon from '@material-ui/icons/FileCopy'
import Grid from '@material-ui/core/Grid'

function TokensPage({ generateToken, classes, copyToken, tokens }) {
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
      {map(tokens, (tokenObj, tokenId) => (
        <Paper key={tokenId} className={classes.tokenCard}>
          <Grid container spacing={12}>
            <Grid item xs={3}>
              <Typography component="p">{tokenObj.token}</Typography>
            </Grid>
            <Grid item xs={3}>
              <IconButton
                aria-label="Copy Token"
                color="inherit"
                onClick={copyToken}>
                <CopyIcon className={classes.icon} />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}
    </div>
  )
}

TokensPage.propTypes = {
  params: PropTypes.shape({
    projectId: PropTypes.string.isRequired
  }),
  generateToken: PropTypes.func.isRequired,
  copyToken: PropTypes.func.isRequired,
  tokens: PropTypes.object, // from enhancer (withStateHandlers)
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TokensPage
