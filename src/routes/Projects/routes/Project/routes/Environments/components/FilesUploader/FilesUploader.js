import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import UploadIcon from '@material-ui/icons/CloudUpload'
import LoadingSpinner from 'components/LoadingSpinner'
import styles from './FilesUploader.styles'

const useStyles = makeStyles(styles)

function FilesUploader({
  onFilesDrop,
  isUploading,
  isCompact,
  maxSelection,
  disabled,
  acceptedFormats,
  dropFiles,
  droppedFiles,
  label
}) {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      {!isUploading ? (
        <Dropzone
          onDrop={onFilesDrop || dropFiles}
          className={`${classes.dropzone} ${
            isCompact && classes.dropzoneCompact
          }`}
          activeClassName={classes.dropzoneActive}
          disableClick={disabled}
          accept={acceptedFormats.join(', ')}
          data-test="file-uploader"
          inputProps={{ 'data-test': 'file-uploader-input' }}>
          <UploadIcon
            className={classes[`icon${isCompact ? 'Compact' : ''}`]}
          />
          <Typography
            className={classes[`dropzone${isCompact ? 'Text' : 'Title'}`]}>
            Drag & Drop
          </Typography>
          <div className={classes.dropzoneText}>
            {label} or <span className="underline">browse</span>
          </div>
        </Dropzone>
      ) : (
        <div className={classes.dropzone}>
          <LoadingSpinner />
        </div>
      )}
    </div>
  )
}

FilesUploader.propTypes = {
  maxSelection: PropTypes.number,
  isCompact: PropTypes.bool,
  isUploading: PropTypes.bool,
  label: PropTypes.string,
  droppedFiles: PropTypes.array,
  acceptedFormats: PropTypes.array,
  disabled: PropTypes.bool,
  onFilesDrop: PropTypes.func,
  dropFiles: PropTypes.func // from enhancer (withStateHandlers)
}

FilesUploader.defaultProps = {
  label: 'files',
  acceptedFormats: [
    // 'image/png',
    // 'image/jpg',
    // 'image/jpeg',
    // 'image/gif',
    // 'image/bmp',
    'application/octet-stream',
    'application/json'
  ]
}

export default FilesUploader
