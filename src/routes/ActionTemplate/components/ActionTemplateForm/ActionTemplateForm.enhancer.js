import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

export default compose(
  withRouter,
  // Get template from redux state (listener in ActionTemplatePage)
  connect(({ firebase: { auth }, firestore: { data } }, { templateId }) => {
    const template = get(data, `actionTemplates.${templateId}`)
    const uid = get(auth, 'uid')
    const isOwner = uid === get(template, 'createdBy')
    const isCollaborator = get(template, `collaborators.${uid}`, false)
    return {
      editable: isOwner || isCollaborator,
      initialValues: template || {
        environments: [{ required: false }]
      }
    }
  })
)
