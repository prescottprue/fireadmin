import { compose } from 'redux'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

export default compose(
  firebaseConnect(['MigrationTemplates']),
  connect(({ firebase: { data } }) => ({
    MigrationTemplates: data['MigrationTemplates']
  }))
)
