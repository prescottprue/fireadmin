import React from 'react'
import { map } from 'lodash'
import PropTypes from 'prop-types'
import Paper from 'material-ui/Paper'
import classes from './ServiceAccounts.scss'

export const ServiceAccounts = ({
  serviceAccounts,
  onAccountClick,
  selectedAccounts
}) => (
  <div className={classes.container}>
    {map(serviceAccounts, (account, key) => (
      <Paper
        key={key}
        className={`${classes.account} ${selectedAccounts[key]
          ? classes.selected
          : ''}`}
        onClick={() => onAccountClick(key, account)}>
        {account.name}
      </Paper>
    ))}
  </div>
)

ServiceAccounts.propTypes = {
  serviceAccounts: PropTypes.object,
  selectedAccounts: PropTypes.object,
  onAccountClick: PropTypes.func
}

export default ServiceAccounts
