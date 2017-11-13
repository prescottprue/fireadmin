import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { firebasePaths } from 'constants'
import { firebaseConnect, pathToJS, dataToJS } from 'react-redux-firebase'
import <%= pascalEntityName %> from '../components/<%= pascalEntityName %>'

@firebaseConnect([
  firebasePaths.<%= camelEntityName %>
])
@connect(
  ({ firebase }) => ({
    <%= camelEntityName %>: dataToJS(firebase, firebasePaths.<%= camelEntityName %>),
  })
)
export default class <%= pascalEntityName %>Container extends Component {
  static propTypes = {
    <%= camelEntityName %>: PropTypes.object
  }

  render() {
    return (
      <<%= pascalEntityName %> />
    )
  }
}
