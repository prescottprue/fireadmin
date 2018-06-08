import React from 'react'
import PropTypes from 'prop-types'
import { Field } from 'redux-form'
import { TextField } from 'redux-form-material-ui'
import Dialog, {
  DialogTitle,
  DialogActions,
  DialogContent
} from 'material-ui/Dialog'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import List, { ListItem, ListItemText } from 'material-ui/List'
import Checkbox from 'material-ui/Checkbox'
import { required, validateDatabaseUrl } from 'utils/form'
import FilesUploader from '../FilesUploader'
import classes from './AddEnvironmentDialog.scss'

export const AddEnvironmentDialog = ({
  callSubmit,
  handleSubmit,
  reset,
  submitting,
  projectId,
  pristine,
  isEditing,
  serviceAccounts,
  selectedServiceAccountInd,
  selectServiceAccount,
  onRequestClose,
  initialValues,
  onAccountClick,
  closeAndReset,
  dropFiles,
  droppedFiles,
  open
}) => (
  <Dialog onClose={onRequestClose} open={open}>
    <DialogTitle id="dialog-title">{`${
      isEditing ? 'Edit' : 'Add'
    } Environment`}</DialogTitle>
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
  serviceAccounts: PropTypes.object,
  selectedServiceAccountInd: PropTypes.number,
  onRequestClose: PropTypes.func,
  onAccountClick: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired,
  callSubmit: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  projectId: PropTypes.string,
  droppedFiles: PropTypes.array,
  open: PropTypes.bool.isRequired, // captured in other
  initialValues: PropTypes.object, // from reduxForm
  selectServiceAccount: PropTypes.func.isRequired, // from enhancer (withStateHandlers)
  closeAndReset: PropTypes.func.isRequired, // from enhancer (withHandlers)
  dropFiles: PropTypes.func.isRequired, // from enhancer (withHandlers)
  reset: PropTypes.func.isRequired, // from reduxForm
  submitting: PropTypes.bool.isRequired, // from reduxForm
  pristine: PropTypes.bool.isRequired // from reduxForm
}

export default AddEnvironmentDialog
