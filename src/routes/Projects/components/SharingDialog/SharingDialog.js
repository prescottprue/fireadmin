import React from 'react'
import PropTypes from 'prop-types'
import Dialog, { DialogTitle } from 'material-ui-next/Dialog'
import Paper from 'material-ui-next/Paper'
import FlatButton from 'material-ui/FlatButton'
import Button from 'material-ui-next/Button'
import { MenuItem } from 'material-ui-next/Menu'
// import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Autosuggest from 'react-autosuggest'
import match from 'autosuggest-highlight/match'
import parse from 'autosuggest-highlight/parse'
import classes from './SharingDialog.scss'

function renderInput(inputProps) {
  const { classes, autoFocus, value, ref, ...other } = inputProps

  return (
    <TextField
      autoFocus={autoFocus}
      className={classes.textField}
      value={value}
      inputRef={ref}
      InputProps={{
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  )
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const matches = match(suggestion.label, query)
  const parts = parse(suggestion.label, matches)

  return (
    <MenuItem selected={isHighlighted} component="div">
      <div>
        {parts.map((part, index) => {
          return part.highlight ? (
            <span key={index} style={{ fontWeight: 300 }}>
              {part.text}
            </span>
          ) : (
            <strong key={index} style={{ fontWeight: 500 }}>
              {part.text}
            </strong>
          )
        })}
      </div>
    </MenuItem>
  )
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  )
}

function getSuggestionValue(suggestion) {
  return suggestion.label
}

// function getSuggestions(value) {
//   const inputValue = value.trim().toLowerCase()
//   const inputLength = inputValue.length
//   let count = 0
//
//   return inputLength === 0
//     ? []
//     : suggestions.filter(suggestion => {
//         const keep =
//           count < 5 &&
//           suggestion.label.toLowerCase().slice(0, inputLength) === inputValue
//
//         if (keep) {
//           count += 1
//         }
//
//         return keep
//       })
// }

export const SharingDialog = ({
  open,
  onRequestClose,
  handleSubmit,
  suggestions,
  searchUsers,
  clearSuggestions,
  value = ' ',
  handleChange
}) => (
  <Dialog open={open} onRequestClose={onRequestClose}>
    <DialogTitle>Sharing</DialogTitle>
    <form onSubmit={handleSubmit} className={classes.inputs}>
      {/* TODO: Add autocomplete that searches users */}
      <Button color="primary">Add Collaborator</Button>
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={suggestions || []}
        onSuggestionsFetchRequested={searchUsers}
        onSuggestionsClearRequested={clearSuggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          autoFocus: true,
          classes,
          placeholder: 'Search a country (start with a)',
          value,
          onChange: handleChange
        }}
      />
    </form>
    <FlatButton label="Done" secondary onTouchTap={onRequestClose} />
  </Dialog>
)

SharingDialog.propTypes = {
  open: PropTypes.bool,
  value: PropTypes.string,
  suggestions: PropTypes.array, // from enhancer
  searchUsers: PropTypes.func.isRequired, // from enhancer (withHandlers)
  clearSuggestions: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  onRequestClose: PropTypes.func, // from enhancer (withStateHandlers)
  handleChange: PropTypes.func, // from enhancer (reduxForm)
  handleSubmit: PropTypes.func // from enhancer (reduxForm)
}

export default SharingDialog
