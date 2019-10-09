import { connect } from 'react-redux'

export default connect(({ firebase: { auth: { uid } } }) => ({
  uid
}))
