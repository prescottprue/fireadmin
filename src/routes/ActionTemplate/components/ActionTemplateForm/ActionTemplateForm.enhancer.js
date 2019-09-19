import { reduxForm } from 'redux-form'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps, withHandlers } from 'recompose'
import { withRouter } from 'react-router-dom'
import { ACTION_TEMPLATES_PATH } from 'constants/paths'
import { ACTION_TEMPLATE_FORM_NAME } from 'constants/formNames'

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
  }),
  // Create form (submitted by submit button)
  reduxForm({
    form: ACTION_TEMPLATE_FORM_NAME,
    enableReinitialize: true
  }),
  // Add props
  withProps(({ editable, pristine, submitting }) => ({
    submitTooltip: !editable
      ? 'Must be owner'
      : !pristine && !submitting
      ? 'Save Template'
      : 'Nothing to publish',
    cancelTooltip: pristine || submitting ? 'Nothing to undo' : 'Undo',
    deleteTooltip: editable ? 'Delete Template' : 'Must be owner'
  })),
  withHandlers({
    goBack: ({ history }) => () => history.push(ACTION_TEMPLATES_PATH)
  })
)
