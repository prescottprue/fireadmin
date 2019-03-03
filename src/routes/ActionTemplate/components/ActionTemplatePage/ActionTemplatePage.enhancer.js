import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { firebasePaths } from 'constants'
import { withHandlers, withStateHandlers, withProps } from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withNotifications } from 'modules/notification'
import {
  spinnerWhileLoading,
  withRouter,
  renderWhile,
  renderIfError
} from 'utils/components'
import TemplateLoadingError from './TemplateLoadingError'
import TemplateNotFound from './TemplateNotFound'
import * as handlers from './ActionTemplatePage.handlers'

export default compose(
  withNotifications,
  withRouter,
  // Set listeners for Firestore
  firestoreConnect(props => [
    {
      collection: `${firebasePaths.actionTemplates}`,
      doc: props.params.templateId
    }
  ]),
  // map redux state to props
  connect(({ firestore: { data: { actionTemplates } } }, { params }) => ({
    template: get(actionTemplates, params.templateId)
  })),
  // Show spinner while template is loading
  spinnerWhileLoading(['template']),
  // Render Error page if there is an error loading the action template
  renderIfError(
    (state, { params: { templateId } }) => [
      `${firebasePaths.actionTemplates}.${templateId}`
    ],
    TemplateLoadingError
  ),
  withProps(({ template }) => ({ templateExists: !!template })),
  // Render Template Not Found page if template does not exist
  renderWhile(({ templateExists }) => !templateExists, TemplateNotFound),
  withStateHandlers(
    ({ deleteDialogInitial = false }) => ({
      deleteDialogOpen: deleteDialogInitial
    }),
    {
      startTemplateDelete: () => () => ({
        deleteDialogOpen: true
      }),
      toggleDeleteDialog: ({ deleteDialogOpen }) => () => ({
        deleteDialogOpen: !deleteDialogOpen
      })
    }
  ),
  // Add handlers as props
  withHandlers(handlers)
)
