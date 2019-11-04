import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { withRouter } from 'react-router-dom'
import {
  withHandlers,
  withStateHandlers,
  withProps,
  setPropTypes
} from 'recompose'
import firestoreConnect from 'react-redux-firebase/lib/firestoreConnect'
import { withNotifications } from 'modules/notification'
import {
  spinnerWhileLoading,
  renderWhile,
  renderIfError
} from 'utils/components'
import { ACTION_TEMPLATES_PATH } from 'constants/firebasePaths'
import TemplateLoadingError from './TemplateLoadingError'
import TemplateNotFound from './TemplateNotFound'
import * as handlers from './ActionTemplatePage.handlers'

export default compose(
  withNotifications,
  withRouter,
  setPropTypes({
    match: PropTypes.shape({
      params: PropTypes.shape({
        templateId: PropTypes.string.isRequired
      }).isRequired
    }).isRequired
  }),
  withProps(({ match: { params: { templateId } } }) => ({
    templateId
  })),
  // Set listeners for Firestore
  firestoreConnect(({ templateId }) => [
    {
      collection: ACTION_TEMPLATES_PATH,
      doc: templateId
    }
  ]),
  // map redux state to props
  connect(({ firestore: { data: { actionTemplates } } }, { templateId }) => ({
    template: get(actionTemplates, templateId)
  })),
  // Show spinner while template is loading
  spinnerWhileLoading(['template']),
  // Render Error page if there is an error loading the action template
  renderIfError(
    (state, { templateId }) => [`${ACTION_TEMPLATES_PATH}.${templateId}`],
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
