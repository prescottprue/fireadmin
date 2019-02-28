import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { withHandlers, setPropTypes } from 'recompose'
import { formNames } from 'constants/paths'
import * as handlers from './ActionTemplateStep.handlers'

const selector = formValueSelector(formNames.actionTemplate)

export default compose(
  connect((state, props) => selector(state, 'inputs', 'steps')),
  setPropTypes({
    fields: PropTypes.shape({
      map: PropTypes.func.isRequired, // used in component
      push: PropTypes.func.isRequired // used in handlers
    })
  }),
  withHandlers(handlers)
)
