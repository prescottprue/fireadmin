import { compose } from 'redux'
import { connect } from 'react-redux'
import { withProps } from 'recompose'
import { withStyles } from '@material-ui/core/styles'
import styles from './CollectionSearch.styles'

export default compose(
  connect(({ firebase: { auth: { uid } } }) => ({
    uid
  })),
  withProps(({ uid, ignoreSuggestions }) => {
    // Map ignore suggestions list to get ids
    const ignoreIds = !ignoreSuggestions
      ? [uid] // ignore just logged in user if no ignoreSuggestions provided
      : [uid].concat(
          // ignore logged in user and ignoreSuggestions
          ignoreSuggestions.map(
            suggestion => suggestion.id || suggestion.objectID
          )
        )
    return {
      filterString: ignoreIds
        .map(
          (id, index) =>
            `${
              index !== 0 && index !== ignoreIds.length ? 'AND ' : ''
            }NOT objectID:${id}`
        )
        .join(' ')
    }
  }),
  withStyles(styles)
)
