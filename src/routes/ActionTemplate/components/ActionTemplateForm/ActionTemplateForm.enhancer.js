import { reduxForm } from 'redux-form'
import { compose } from 'redux'
import { withProps } from 'recompose'
import { withStyles } from 'material-ui'
import { formNames } from 'constants'
import { connect } from 'react-redux'
import { get } from 'lodash'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    cursor: 'finger'
  }
})

export default compose(
  // Get template from redux state (listener in ActionTemplatePage)
  connect(({ firebase: { auth }, firestore: { data } }, { templateId }) => {
    const template = get(data, `actionTemplates.${templateId}`)
    const uid = get(auth, 'uid')
    const isOwner = uid === get(template, 'createdBy')
    const isCollaborator = get(template, `collaborators.${uid}`, false)
    return {
      editable: isOwner || isCollaborator,
      initialValues: template || {
        environments: [{ type: 'serviceAccount' }]
      }
    }
  }),
  // Create form (submitted by submit button)
  reduxForm({
    form: formNames.actionTemplate,
    enableReinitialize: true
  }),
  // Add props
  withProps(({ editable, pristine, submitting }) => ({
    submitTooltip: editable && pristine && !submitting ? 'Save Template' : null,
    cancelTooltip: pristine || submitting ? null : 'Undo'
  })),
  withStyles(styles)
)
