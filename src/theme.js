import {
  orange100,
  orange800,
  pinkA200,
  tealA100,
  lightBlue500,
  grey900,
  white,
  grey400,
  darkBlack
} from 'material-ui/styles/colors'
import blue from 'material-ui-next/colors/blue'
import { fade } from 'material-ui/utils/colorManipulator'
import spacing from 'material-ui/styles/spacing'
import zIndex from 'material-ui/styles/zIndex'

export default {
  spacing,
  zIndex: zIndex,
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary: blue,
    primary1Color: orange800,
    primary2Color: grey400,
    primary3Color: orange100,
    accent1Color: pinkA200,
    accent2Color: tealA100,
    accent3Color: lightBlue500,
    textColor: grey900,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey400,
    disabledColor: fade(darkBlack, 0.3),
    pickerHeaderColor: pinkA200
  }
}
