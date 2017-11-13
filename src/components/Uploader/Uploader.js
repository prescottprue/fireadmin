import React, { PropTypes } from 'react'
import Dropzone from 'react-dropzone'
import { map, size } from 'lodash'
import IconButton from 'material-ui/IconButton'
import Paper from 'material-ui/Paper'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import UploadIcon from 'material-ui/svg-icons/file/cloud-upload'
import Delete from 'material-ui/svg-icons/action/delete'
import { List, ListItem } from 'material-ui/List'
import IconMenu from 'material-ui/IconMenu'
import MenuItem from 'material-ui/MenuItem'
import LoadingSpinner from 'components/LoadingSpinner'
import classes from './Uploader.scss'

const iconButtonElement = (
  <IconButton touch tooltip="more" tooltipPosition="bottom-left">
    <MoreVertIcon />
  </IconButton>
)

const fileText = file => (
  <a
    className={classes.docName}
    href={file.downloadURL}
    target="_blank"
    rel="noopener noreferrer">
    {file.name}
  </a>
)

const fileMenu = (key, file, onFileDelete) => (
  <IconMenu iconButtonElement={iconButtonElement}>
    <MenuItem leftIcon={<Delete />} onClick={() => onFileDelete(key, file)}>
      Delete
    </MenuItem>
  </IconMenu>
)

export const Uploader = ({ files, onFilesDrop, isUploading, onFileDelete }) => (
  <div className={classes.container}>
    <Paper className={classes.dropzonePanel}>
      {!isUploading ? (
        <Dropzone
          onDrop={onFilesDrop}
          className={classes.dropzone}
          activeClassName={classes.dropzoneActive}
          accept="application/pdf, image/png, image/jpeg, image/jpg">
          <UploadIcon style={{ width: 64, height: 64 }} />
          <div className={classes.dropzoneTitle}>Drag & Drop</div>
          <div className={classes.dropzoneText}>
            files here or click to browse.
            <br />
            <br />
            Supported files types are
            <strong> PDF, </strong>
            <strong> JPEG, </strong> and
            <strong> PNG. </strong>
          </div>
        </Dropzone>
      ) : (
        <LoadingSpinner />
      )}
    </Paper>
    <div className={classes.docs}>
      <h3 className={classes.docsTitle}>Uploaded Documents</h3>
      {size(files) ? (
        <Paper className={classes.docsPanel}>
          <List style={{ borderRadius: '3px', width: '100%' }}>
            {map(files, (file, key) => (
              <ListItem
                key={`File-${key}`}
                style={{ width: '100%' }}
                primaryText={fileText(file)}
                rightIconButton={fileMenu(key, file, onFileDelete)}
              />
            ))}
          </List>
        </Paper>
      ) : (
        <div className={classes.docsEmpty}>
          <span>No Files Uploaded</span>
        </div>
      )}
    </div>
  </div>
)

Uploader.propTypes = {
  files: PropTypes.object,
  onFilesDrop: PropTypes.func,
  onFileDelete: PropTypes.func,
  isUploading: PropTypes.bool
}

export default Uploader
