import { compose } from 'redux'
import { get } from 'lodash'
import { withProps } from 'recompose'
import { formValues } from 'redux-form'

export default compose(
  formValues('inputValues'),
  withProps(({ step, inputValues }) => ({
    convertEnv: (step, name) => {
      const { pathType } = get(step, `${name}`, {})
      if (pathType === 'input') {
        return get(inputValues, get(step, `${name}.path`))
      }
      return get(step, `${name}.path`)
    }
  }))
)
