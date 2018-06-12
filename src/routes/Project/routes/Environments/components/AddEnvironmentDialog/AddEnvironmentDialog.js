import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import { required, validateDatabaseUrl } from 'utils/form'
import FilesUploader from '../FilesUploader'
import classes from './AddEnvironmentDialog.scss'

export const AddEnvironmentDialog = ({
  callSubmit,
  handleSubmit,
  submitting,
  projectId,
  pristine,
  selectedServiceAccountInd,
  selectServiceAccount,
  onRequestClose,
  closeAndReset,
  dropFiles,
  droppedFiles,
  open
}) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">Add Environment</DialogTitle>
    <DialogContent className={classes.body}>
      <form className={classes.inputs} onSubmit={handleSubmit}>
        <Field
          component={TextField}
          className={classes.field}
          name="name"
          validate={required}
          fullWidth
          label="Environment Name"
        />
        <Field
          component={TextField}
          className={classes.field}
          name="databaseURL"
          fullWidth
          validate={[required, validateDatabaseUrl]}
          label="Database URL"
        />
        <Field
          component={TextField}
          className={classes.field}
          fullWidth
          name="description"
          label="Instance Description"
        />
      </form>
      <div className={classes.serviceAccounts}>
        <Typography style={{ fontSize: '1.1rem' }}>Service Account</Typography>
        <FilesUploader
          onFilesDrop={dropFiles}
          label="to upload service account"
        />
        <List>
          {droppedFiles && droppedFiles.length
            ? droppedFiles.map((file, i) => (
                <ListItem
                  key={`${i}-${file.name}`}
                  role={undefined}
                  dense
                  button
                  onClick={() => selectServiceAccount(i)}>
                  <Checkbox
                    checked={selectedServiceAccountInd === i}
                    tabIndex={-1}
                    disableRipple
                  />
                  <ListItemText primary={file.name} />
                </ListItem>
              ))
            : null}
        </List>
      </div>
    </DialogContent>
    <DialogActions>
      <Button color="secondary" disabled={submitting} onClick={closeAndReset}>
        Cancel
      </Button>
      <Button
        color="primary"
        disabled={pristine || submitting}
        onClick={callSubmit}>
        Create
      </Button>
    </DialogActions>
  </Dialog>
)

AddEnvironmentDialog.propTypes = {
  selectedServiceAccountInd: PropTypes.number,
  onRequestClose: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  callSubmit: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  droppedFiles: PropTypes.array,
  open: PropTypes.bool.isRequired, // captured in other
  selectServiceAccount: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  closeAndReset: PropTypes.func.isRequired, // from enhancer (withHandlers)
  dropFiles: PropTypes.func.isRequired, // from enhancer (withHandlers)
  submitting: PropTypes.bool.isRequired, // from reduxForm
  pristine: PropTypes.bool.isRequired // from reduxForm
}

export default AddEnvironmentDialog
