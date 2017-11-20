import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  firebaseConnect(['<%= pascalEntityName %>']),
  connect(({ firebase: { data } }) => ({
    '<%= pascalEntityName %>': getVal(data, '<%= pascalEntityName %>')
  })),
)
