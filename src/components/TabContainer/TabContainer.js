import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'

export const TabContainer = ({ children }) => (
  <Typography component="div" style={{ padding: 8 * 3 }}>
    {children}
  </Typography>
)

TabContainer.propTypes = {
  children: PropTypes.object
}

export default TabContainer
