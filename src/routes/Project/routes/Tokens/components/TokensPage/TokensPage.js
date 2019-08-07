import React from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { map } from 'lodash'

function TokensPage({ generateToken, classes, tokens }) {
  return (
    <div>
      <Typography className={classes.pageHeader}>Tokens</Typography>
      <div className={classes.buttons}>
        <Button
          color="primary"
          variant="contained"
          aria-label="Add Member"
          onClick={generateToken}>
          Add Token
        </Button>
      </div>
      {map(tokens, (tokenObj, tokenId) => (
        <Paper>
          <Typography variant="h6">{tokenObj.createdAt}</Typography>
          <Typography className={classes.pageHeader}>
            {tokenObj.token}
          </Typography>
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
  tokens: PropTypes.object, // from enhancer (firestoreConnect + connect)
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default TokensPage
