import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import ApiKeyItem from '../ApiKeyItem'

function ApiKeysSection({ classes, generateApiKey, tokens }) {
  return (
    <Paper className={classes.root}>
      <Typography className={classes.pageHeader}>Tokens</Typography>
      <Grid container spacing={16}>
        {!tokens || !tokens.length ? (
          <Typography>No Tokens Found</Typography>
        ) : (
          tokens
            .filter(t => !!t)
            .map(apiKeyMetaObj => {
              if (!apiKeyMetaObj) {
                return null
              }
              return (
                <ApiKeyItem
                  key={apiKeyMetaObj.id}
                  apiKey={apiKeyMetaObj.id}
                  {...apiKeyMetaObj}
                />
              )
            })
        )}
      </Grid>
      <Grid container spacing={16} className={classes.buttons} justify="center">
        <Grid item xs={2}>
          <Button
            color="primary"
            variant="contained"
            aria-label="Add Member"
            onClick={generateApiKey}>
            Generate API Key
          </Button>
        </Grid>
      </Grid>
    </Paper>
  )
}

ApiKeysSection.propTypes = {
  generateApiKey: PropTypes.func.isRequired, // from enhancer (withHandlers)
  tokens: PropTypes.array, // from enhancer (withStateHandlers)
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default ApiKeysSection
