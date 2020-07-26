import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
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
import { makeStyles } from '@material-ui/core/styles'
import { validateDatabaseUrl } from 'utils/form'
import TextField from '@material-ui/core/TextField'
import FilesUploader from '../FilesUploader'
import styles from './AddEnvironmentDialog.styles'

const useStyles = makeStyles(styles)

function AddEnvironmentDialog({ onSubmit, projectId, onRequestClose, open }) {
  const classes = useStyles()
  const [droppedFiles, updateDroppedFiles] = useState([])
  const [selectedServiceAccountInd, changeSelectedServiceAccount] = useState(
    null
  )

  const {
    register,
    handleSubmit,
    errors,
    formState: { isSubmitting, isValid }
  } = useForm({ mode: 'onChange' })

  function callSubmit(formValues) {
    return onSubmit({
      ...formValues,
      serviceAccount: droppedFiles[selectedServiceAccountInd]
    })
  }

  function selectServiceAccount(pickInd) {
    changeSelectedServiceAccount(
      selectedServiceAccountInd === pickInd ? null : pickInd
    )
  }

  function dropFiles(files) {
    const newDroppedFiles = droppedFiles.concat(files)
    updateDroppedFiles(newDroppedFiles)
    changeSelectedServiceAccount(
      selectedServiceAccountInd ||
        (newDroppedFiles.length && newDroppedFiles.length - 1)
    )
  }
  return (
    <Dialog onClose={onRequestClose} open={open}>
      <DialogTitle id="dialog-title">Add Environment</DialogTitle>
      <form className={classes.inputs} onSubmit={handleSubmit(callSubmit)}>
        <DialogContent className={classes.body}>
          <TextField
            name="name"
            label="Environment Name"
            margin="normal"
            inputRef={register({
              required: true
            })}
            error={!!errors.name}
            helperText={errors.name && 'Name is required'}
            fullWidth
            data-test="new-environment-name"
          />
          <TextField
            name="databaseURL"
            inputRef={register({
              required: true,
              validate: validateDatabaseUrl
            })}
            error={!!errors.databaseURL}
            helperText={errors.databaseURL && 'Database URL must be valid'}
            margin="normal"
            fullWidth
            label="Database URL"
            data-test="new-environment-db-url"
          />
          <TextField
            name="description"
            label="Instance Description"
            inputRef={register}
            margin="normal"
            fullWidth
          />
          <div className={classes.serviceAccounts}>
            <Typography style={{ fontSize: '1.1rem' }}>
              Service Account
            </Typography>
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
          <Button
            color="secondary"
            disabled={isSubmitting}
            onClick={onRequestClose}
            data-test="new-environment-cancel-button">
            Cancel
          </Button>
          <Button
            color="primary"
            type="submit"
            disabled={
              !isValid || selectedServiceAccountInd === null || isSubmitting
            }
            data-test="new-environment-create-button">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

AddEnvironmentDialog.propTypes = {
  onRequestClose: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  projectId: PropTypes.string,
  open: PropTypes.bool.isRequired
}

export default AddEnvironmentDialog
