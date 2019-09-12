import React from 'react'
import PropTypes from 'prop-types'
import { map } from 'lodash'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import CopyIcon from '@material-ui/icons/FileCopy'
import Grid from '@material-ui/core/Grid'
import { formatDateTime } from 'utils/formatters'

function ApiKeysSection({ generateApiKey, classes, copyApiKey, tokens }) {
  return (
    <Paper className={classes.root}>
      <Typography className={classes.pageHeader}>Tokens</Typography>
      <Grid container spacing={16}>
        {map(tokens, (apiKeyMetaObj, apiKey) => {
          if (!apiKeyMetaObj) {
            return null
          }
          return (
            <Grid key={apiKey} item xs={12}>
              <div key={apiKey} className={classes.tokenCard}>
                <Grid container spacing={16}>
                  <Grid item xs={5}>
                    <Typography component="p">{apiKey}</Typography>
                  </Grid>
                  <Grid item xs={5}>
                    <Typography component="p">
                      {formatDateTime(apiKeyMetaObj.createdAt)}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <IconButton
                      aria-label="Copy Token"
                      color="inherit"
                      onClick={() => copyApiKey(apiKey)}>
                      <CopyIcon className={classes.icon} />
                    </IconButton>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          )
        })}
      </Grid>
      <Grid container spacing={16} className={classes.buttons} justify="center">
        <Grid item xs={2}>
          <Button
            color="primary"
            variant="contained"
            aria-label="Add Member"
            onClick={generateApiKey}>
            Generate Token
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

ApiKeysSection.propTypes = {
  copyApiKey: PropTypes.func.isRequired, // from enhancer (withHandlers)
  generateApiKey: PropTypes.func.isRequired, // from enhancer (withHandlers)
  tokens: PropTypes.object, // from enhancer (withStateHandlers)
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default ApiKeysSection
