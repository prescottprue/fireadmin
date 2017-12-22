import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebasePaths } from 'constants'
import { firestoreConnect } from 'react-redux-firebase'
import { spinnerWhileLoading } from 'utils/components'

export default compose(
  firestoreConnect(props => [
    {
      collection: `${firebasePaths.migrationTemplates}`,
      doc: props.params.templateId
    }
  ]),
  connect(({ firestore: { data: { migrationTemplates } } }, { params }) => ({
    template: get(migrationTemplates, params.templateId)
  })),
  spinnerWhileLoading(['template'])
)
