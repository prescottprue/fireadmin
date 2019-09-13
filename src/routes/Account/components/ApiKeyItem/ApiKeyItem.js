import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import Grid from '@material-ui/core/Grid'
import CopyIcon from '@material-ui/icons/FileCopy'
import { formatDateTime } from 'utils/formatters'

function ApiKeyItem({ classes, apiKey, createdAt, copyApiKey }) {
  return (
    <Grid item xs={12}>
      <div className={classes.tokenCard}>
        <Grid container spacing={16} justify="center" alignItems="center">
          <Grid item xs={12} md={5} className={classes.metaItem}>
            <Typography component="p">{apiKey}</Typography>
          </Grid>
          <Grid item xs={6} md={5}>
            <Typography component="p">{formatDateTime(createdAt)}</Typography>
          </Grid>
          <Grid item xs={6} md={2} className={classes.metaItem}>
            <IconButton
              aria-label="Copy Token"
              color="inherit"
              onClick={copyApiKey}>
              <CopyIcon className={classes.icon} />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    </Grid>
  )
}

ApiKeyItem.propTypes = {
  classes: PropTypes.object.isRequired, // from enhancer (withStyles)
  copyApiKey: PropTypes.func.isRequired, // from enhancer (withHandlers)
  apiKey: PropTypes.string.isRequired, // from enhancer (withHandlers)
  createdAt: PropTypes.object
}

export default ApiKeyItem
