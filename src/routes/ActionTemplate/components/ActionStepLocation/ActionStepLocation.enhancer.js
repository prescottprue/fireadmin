import { compose } from 'redux'
import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { formNames } from 'constants'

const selector = formValueSelector(formNames.actionTemplate)

export default compose(
  connect((state, props) => selector(state, 'inputs', 'steps'))
)
