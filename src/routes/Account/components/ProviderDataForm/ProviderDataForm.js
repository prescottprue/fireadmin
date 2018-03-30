import React from 'react'
import PropTypes from 'prop-types'
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List'
import classes from './ProviderDataForm.scss'
import AccountCircle from 'material-ui-icons/AccountCircle'

export const ProviderData = ({ providerData }) => (
  <div className={classes.container}>
    <List>
      {providerData.map((providerAccount, i) => (
        <ListItem component="nav" key={i}>
          <ListItemIcon>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText>
            <span>
              {providerAccount.providerId || 'Provider'} -{' '}
              {providerAccount.email}
            </span>
          </ListItemText>
        </ListItem>
      ))}
    </List>
  </div>
)

ProviderData.propTypes = {
  providerData: PropTypes.array.isRequired
}

export default ProviderData
