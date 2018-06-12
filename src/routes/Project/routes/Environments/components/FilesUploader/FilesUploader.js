import React from 'react'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import LoadingSpinner from 'components/LoadingSpinner'
import UploadIcon from 'material-ui-icons/CloudUpload'
import classes from './FilesUploader.scss'

export const FilesUploader = ({
  onFilesDrop,
  isUploading,
  isCompact,
  maxSelection,
  disabled,
  acceptedFormats,
  dropFiles,
  droppedFiles,
  label
}) => (
  <div className={classes.container}>
    {!isUploading ? (
      <Dropzone
        onDrop={onFilesDrop || dropFiles}
        className={`${classes.dropzone} ${isCompact &&
          classes.dropzoneCompact}`}
        activeClassName={classes.dropzoneActive}
        disableClick={disabled}
        accept={acceptedFormats.join(', ')}>
        <UploadIcon className={classes[`icon${isCompact ? 'Compact' : ''}`]} />
        <div className={classes[`dropzone${isCompact ? 'Text' : 'Title'}`]}>
          Drag & Drop
        </div>
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
    'application/json'
  ]
}

export default FilesUploader
