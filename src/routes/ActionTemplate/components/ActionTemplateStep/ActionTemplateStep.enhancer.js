import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withHandlers, setPropTypes } from 'recompose'
import * as handlers from './ActionTemplateStep.handlers'

export default compose(
  setPropTypes({
    fields: PropTypes.shape({
      map: PropTypes.func.isRequired, // used in component
      push: PropTypes.func.isRequired // used in handlers
    })
  }),
  withHandlers(handlers)
)
