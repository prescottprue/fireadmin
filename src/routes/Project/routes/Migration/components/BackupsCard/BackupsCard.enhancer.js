import { compose } from 'redux'
import { flattenProp } from 'recompose'

export default compose(flattenProp('project'))
