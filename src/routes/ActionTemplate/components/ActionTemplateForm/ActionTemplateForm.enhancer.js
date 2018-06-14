import { reduxForm } from 'redux-form'
import { get } from 'lodash'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps, withHandlers } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import { withRouter } from 'utils/components'
import { formNames, paths } from 'constants'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    cursor: 'finger'
  }
})

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
    submitTooltip: !editable
      ? 'Must be owner'
      : !pristine && !submitting
        ? 'Save Template'
        : 'Nothing to publish',
    cancelTooltip: pristine || submitting ? 'Nothing to undo' : 'Undo',
    deleteTooltip: editable ? 'Delete Template' : 'Must be owner'
  })),
  withHandlers({
    goBack: ({ router }) => () => router.push(paths.actionTemplates)
  }),
  withStyles(styles)
)
