import RTDBItem from './connectors/RTDBItem';
import { DISPLAY_NAMES_PATH } from './constants/firebasePaths';

export default class DisplayNames extends RTDBItem {
  constructor() {
    super(DISPLAY_NAMES_PATH)
    this.path = DISPLAY_NAMES_PATH
  }
  public path: string
}