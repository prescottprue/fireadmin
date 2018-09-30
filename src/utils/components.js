/* eslint-disable no-console */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  pick,
  some,
  get,
  reduce,
  isFunction,
  toPath,
  size,
  isArray
} from 'lodash'
import { connect } from 'react-redux'
import LoadingSpinner from 'components/LoadingSpinner'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import {
  compose,
  mapProps,
  setDisplayName,
  branch,
  renderComponent
} from 'recompose'

/**
 * Show a loading spinner when a condition is truthy. Used within
 * spinnerWhileLoading. Accepts a test function and a higher-order component.
 * @param  {Function} condition - Condition function for when to show spinner
 * @return {HigherOrderComponent}
 */
export function spinnerWhile(condition) {
  return branch(condition, renderComponent(LoadingSpinner))
}

/**
 * Show a loading spinner while props are loading . Checks
 * for undefined, null, or a value (as well as handling `auth.isLoaded` and
 * `profile.isLoaded`). **NOTE:** Meant to be used with props which are passed
 * as props from state.firebase using connect (from react-redux), which means
 * it could have unexpected results for other props
 * @example Spinner While Data Loading
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import { firebaseConnect } from 'react-redux-firebase'
 *
 * const enhance = compose(
 *   firebaseConnect(['projects']),
 *   connect(({ firebase: { data: { projects } } })),
 *   spinnerWhileLoading(['projects'])
 * )
 *
 * export default enhance(SomeComponent)
 * @param  {Array} propNames - List of prop names to check loading for
 * @return {HigherOrderComponent}
 */
export function spinnerWhileLoading(propNames) {
  return spinnerWhile(props =>
    some(propNames, name => !isLoaded(get(props, name)))
  )
}

/**
 * HOC that shows a component while condition is true
 * @param  {Function} condition - function which returns a boolean indicating
 * whether to render the provided component or not
 * @param  {React.Component} component - React component to render if condition
 * is true
 * @return {HigherOrderComponent}
 */
export function renderWhile(condition, component) {
  return branch(condition, renderComponent(component))
}

/**
 * HOC that shows a component while any of a list of props loaded from Firebase
 * is empty (uses react-redux-firebase's isEmpty).
 * @param  {Array} propNames - List of prop names to check loading for
 * @param  {React.Component} component - React component to render if prop loaded
 * from Firebase is empty
 * @return {HigherOrderComponent}
 * @example
 * renderWhileEmpty(['todos'], () => <div>Todos Not Found</div>),
 */
export function renderWhileEmpty(propsNames, component) {
  return renderWhile(
    // Any of the listed prop name correspond to empty props (supporting dot path names)
    props =>
      some(propsNames, name => {
        const propValue = get(props, name)
        return (
          isLoaded(propValue) &&
          (isEmpty(propValue) || (isArray(propValue) && !size(propValue)))
        )
      }),
    component
  )
}

/**
 * HOC that shows a component while any of a list of props isEmpty
 * @param  {Array} listenerPaths - List of listener paths which to check for errors
 * withing Firestore
 * @param  {React.Component} component - React component to render if any of
 * the provied listener paths have errors
 * @return {HigherOrderComponent}
 */
export function renderIfError(listenerPaths, component) {
  return compose(
    connect((state, props) => {
      const {
        firestore: { errors }
      } = state
      const listenerErrors = reduce(
        listenerPaths,
        (acc, listenerConfig) => {
          const listenerName = isFunction(listenerConfig)
            ? listenerConfig(state, props)
            : listenerConfig
          const listenerError = get(
            errors,
            `byQuery.${toPath(listenerName).join('/')}`
          )
          if (listenerError) {
            return acc.concat({ name: listenerName, error: listenerError })
          }
          return acc
        },
        []
      )
      return {
        listenerErrors,
        errorMessage: get(listenerErrors, '0.error.code')
      }
    }),
    renderWhile(
      // Any of the listed prop name correspond to empty props (supporting dot path names)
      ({ listenerErrors }) => listenerErrors.length,
      component
    ),
    setDisplayName('renderIfError')
  )
}

/**
 * HOC that logs props using console.log. Accepts an array list of prop names
 * to log, if none provided all props are logged. **NOTE:** Only props at
 * available to the HOC will be logged.
 * @example Log Single Prop
 * import { compose } from 'redux'
 * import { connect } from 'react-redux'
 * import { firebaseConnect } from 'react-redux-firebase'
 *
 * const enhance = compose(
 *   withProps(() => ({ projectName: 'test' })),
 *   logProps(['projectName']) // 'test' would be logged to console when SomeComponent is rendered
 * )
 *
 * export default enhance(SomeComponent)
 * @param  {Array} propNames - List of prop names to log. If none provided, all
 * are logged
 * @return {HigherOrderComponent}
 */
export function logProps(propNames, logName = '') {
  return mapProps(ownerProps => {
    console.log(
      `${logName} props:`,
      propNames ? pick(ownerProps, propNames) : ownerProps
    )
    return ownerProps
  })
}

/**
 * Create a function which returns an HOC. The Higher Order Component
 * has the provided variable pulled from context and passed as a prop
 * @param {String} withVar - Variable to pass from context to props
 * @example Router
 * // HOC that adds route to props (from context)
 * export const withRouter = createWithFromContext('router')
 */
export function createWithFromContext(withVar) {
  return WrappedComponent => {
    class WithFromContext extends Component {
      render() {
        const props = { [withVar]: this.context[withVar] }
        if (this.context.store && this.context.store.dispatch) {
          props.dispatch = this.context.store.dispatch
        }
        return <WrappedComponent {...this.props} {...props} />
      }
    }

    WithFromContext.contextTypes = {
      [withVar]: PropTypes.object.isRequired
    }

    return WithFromContext
  }
}

/**
 * HOC that adds router to props
 * @return {HigherOrderComponent}
 * @example Basic
 * // Wrapped is SomeComponent with props.router from context
 * const Wrapped = withRouter(SomeComponent)
 */
export const withRouter = createWithFromContext('router')

/**
 * HOC that adds store to props
 * @return {HigherOrderComponent}
 * @example Basic
 * // Wrapped is SomeComponent with props.store from context
 * const Wrapped = withStore(SomeComponent)
 */
export const withStore = createWithFromContext('store')
