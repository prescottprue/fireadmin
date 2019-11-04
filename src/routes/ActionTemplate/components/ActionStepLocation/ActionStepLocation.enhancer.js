import { connect } from 'react-redux'
import { formValueSelector } from 'redux-form'
import { ACTION_TEMPLATE_FORM_NAME } from 'constants/formNames'

const selector = formValueSelector(ACTION_TEMPLATE_FORM_NAME)

export default connect((state, props) => selector(state, 'inputs', 'steps'))
