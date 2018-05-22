import { compose } from 'redux'
import { connect } from 'react-redux'
import { firestoreConnect } from 'react-redux-firebase'

export default compose(
  firestoreConnect([{
    collection: '<%= pascalEntityName %>'
  }]),
  connect(({ firestore: { data } }) => ({
    <%= pascalEntityName %>: ordered.<%= pascalEntityName %>
  })),
)
