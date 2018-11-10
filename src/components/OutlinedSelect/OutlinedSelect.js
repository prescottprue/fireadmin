import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'

class OutlinedSelect extends React.Component {
  state = {
    age: '',
    name: 'hai',
    labelWidth: 0
  }

  componentDidMount() {
    this.setState({
      labelWidth: ReactDOM.findDOMNode(this.InputLabelRef).offsetWidth
    })
  }
  render() {
    const {
      classes,
      label,
      input,
      children,
      meta: { valid }
    } = this.props

    return (
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel
          ref={ref => {
            this.InputLabelRef = ref
          }}
          htmlFor="outlined-age-simple">
          {label}
        </InputLabel>
        <Select
          fullWidth
          input={
            <OutlinedInput
              labelWidth={this.state.labelWidth}
              style={{ width: '100%' }}
              name="age"
              id="outlined-age-simple"
            />
          }
          {...input}>
          {children}
        </Select>
        {!valid ? <FormHelperText>Select an environment</FormHelperText> : null}
      </FormControl>
    )
  }
}

OutlinedSelect.propTypes = {
  label: PropTypes.string.isRequired,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired // from enhancer (withStyles)
}

export default OutlinedSelect
