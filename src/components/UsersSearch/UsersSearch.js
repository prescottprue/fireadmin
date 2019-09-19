import React from 'react'
import PropTypes from 'prop-types'
import {
  InstantSearch,
  PoweredBy,
  SearchBox,
  Configure
} from 'react-instantsearch/dom'
import { makeStyles } from '@material-ui/core/styles'
import SearchResults from './SearchResults'
import { algolia } from '../../config'
import styles from './UsersSearch.styles'
// import 'react-instantsearch-theme-algolia/style.scss' // didn't work, so css was used from cdn in index.html

const useStyles = makeStyles(styles)

function UsersSearch({ onSuggestionClick, resultsTitle, filterString }) {
  const classes = useStyles()

  return (
    <InstantSearch
      appId={algolia.appId}
      apiKey={algolia.apiKey}
      indexName="users">
      <SearchBox autoFocus />
      <div className={classes.poweredBy}>
        <PoweredBy />
      </div>
      <div className={classes.spacer} />
      <SearchResults
        onSuggestionClick={onSuggestionClick}
        resultsTitle={resultsTitle}
      />
      <Configure filters={filterString} />
    </InstantSearch>
  )
}

UsersSearch.propTypes = {
  filterString: PropTypes.string.isRequired, // from enhancer (withProps)
  onSuggestionClick: PropTypes.func,
  resultsTitle: PropTypes.string
}

export default UsersSearch
