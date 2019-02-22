import React from 'react'
import PropTypes from 'prop-types'
import './Wrapper.css'

function Template({ children }) {
  return (
    <main className="main" role="main">
      {children}
    </main>
  )
}

Template.propTypes = {
  children: PropTypes.object
}

export default Template
