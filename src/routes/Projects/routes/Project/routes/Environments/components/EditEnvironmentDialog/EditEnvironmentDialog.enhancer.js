import { get } from 'lodash'
import { connect } from 'react-redux'
import { currentUserProjectPermissions } from 'selectors'

export default connect((state, props) => {
  const permissionsByType = currentUserProjectPermissions(state, props)
  const envUpdateDisabled =
    get(permissionsByType, 'update.environments') !== true
  return {
    lockedDisabled: envUpdateDisabled,
    readOnlyDisabled: envUpdateDisabled,
    writeOnlyDisabled: envUpdateDisabled
  }
})
