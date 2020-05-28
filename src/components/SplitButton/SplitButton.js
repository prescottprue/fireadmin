import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import Button from '@material-ui/core/Button'
import MenuItem from '@material-ui/core/MenuItem'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'
import Grow from '@material-ui/core/Grow'
import Paper from '@material-ui/core/Paper'
import Popper from '@material-ui/core/Popper'
import MenuList from '@material-ui/core/MenuList'

function SplitButton({
  onChange,
  onClick,
  options,
  buttonStyle,
  ariaLabel = 'split button',
  defaultIndex = 0
}) {
  const [open, setOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex)
  const anchorRef = useRef(null)
  const handleClick = () => {
    onClick(selectedIndex, options[selectedIndex])
  }

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index)
    setOpen(false)
    onChange(index, options[index])
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event) => {
    if (anchorRef.current?.contains(event.target)) {
      return
    }

    setOpen(false)
  }
  return (
    <>
      <ButtonGroup
        variant="contained"
        color="primary"
        ref={anchorRef}
        aria-label={ariaLabel}>
        <Button onClick={handleClick} style={buttonStyle}>
          {options[selectedIndex]}
        </Button>
        <Button
          color="primary"
          size="small"
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label={ariaLabel}
          aria-haspopup="menu"
          onClick={handleToggle}>
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom'
            }}>
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu">
                  {options.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndex}
                      onClick={(event) => handleMenuItemClick(event, index)}>
                      {option}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

SplitButton.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  buttonStyle: PropTypes.object,
  ariaLabel: PropTypes.string,
  defaultIndex: PropTypes.number,
  onClick: PropTypes.func
}

export default SplitButton
