import React, { cloneElement } from 'react'
import PropTypes from 'prop-types'
import { pick, some, filter } from 'lodash'
import LoadingSpinner from 'components/LoadingSpinner'
import { isLoaded, isEmpty } from 'react-redux-firebase'
import {
  compose,
  withContext,
  getContext,
  mapProps,
  branch,
  renderComponent
} from 'recompose'

export const withStore = compose(
  withContext({ store: PropTypes.object }, () => {}),
  getContext({ store: PropTypes.object })
)

export const withRouter = compose(
  withContext({ router: PropTypes.object }, () => {}),
  getContext({ router: PropTypes.object })
)

export const withStoreAndRouter = compose(
  withContext(
    {
      router: PropTypes.object,
      store: PropTypes.object
    },
    () => {}
  ),
  getContext({ router: PropTypes.object, store: PropTypes.object })
)

export const logProps = propNames =>
  mapProps(ownerProps => {
    console.log('props:', propNames ? pick(ownerProps, propNames) : ownerProps) // eslint-disable-line no-console
    return ownerProps
  })

const renderChildrenWithProps = preserveProps => ({ children, ...other }) =>
  cloneElement(children, preserveProps ? pick(preserveProps, other) : other)

/**
 * Render children if they exist. Useful for the enhancers of routes that have
 * child routessdfkljdssadfasdfasdfsdafsf
 * @type {[type]}
 */
export const withChildRoutes = branch(
  ({ children }) => !!children,
  renderComponent(renderChildrenWithProps())
)

/**
 * Render children if they exist. Useful for
 * @type {[type]}
 */
export const childRoutesWithProps = preserveProps =>
  branch(
    ({ children }) => !!children,
    renderComponent(renderChildrenWithProps(preserveProps))
  )

export const spinnerWhile = condition =>
  branch(condition, renderComponent(LoadingSpinner))

export const spinnerWhileLoading = propNames =>
  spinnerWhile(props => some(propNames, name => !isLoaded(props[name])))

const createEmptyMessage = propNames => props => {
  return (
    <div>
      {filter(
        propNames,
        name => isLoaded(props[name]) && isEmpty(props[name])
      ).map((name, i) => <div key={i}>{name}</div>)}
      Empty
    </div>
  )
}

export const messageWhileEmpty = (propNames, emptyComponent) =>
  branch(
    props =>
      some(propNames, name => isLoaded(props[name]) && isEmpty(props[name])),
    renderComponent(emptyComponent || createEmptyMessage(propNames))
  )
