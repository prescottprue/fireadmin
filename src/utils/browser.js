/**
 * Set a string to the clipboard. Useful for click
 * to copy value
 * @param {string} str - String to set to clipboard
 */
export function setStringToClipboard(str) {
  // Create new element
  var el = document.createElement('textarea')
  // Set value (string to be copied)
  el.value = str
  // Set non-editable to avoid focus and move outside of view
  el.setAttribute('readonly', '')
  el.style = { position: 'absolute', left: '-9999px' }
  document.body.appendChild(el)
  // Select text inside element
  el.select()
  // Copy text to clipboard
  document.execCommand('copy')
  // Remove temporary element
  document.body.removeChild(el)
}
