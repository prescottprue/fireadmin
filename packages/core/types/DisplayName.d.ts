import RTDBItem from './connectors/RTDBItem';
import { GetOptions } from './utils/firebase';
export default class DisplayName extends RTDBItem {
    id: string;
    path: string;
    constructor(id: string, displayNameData?: object);
    validate(displayNameData: string): void;
    update(displayNameData: string): Promise<any>;
    get(options?: GetOptions): Promise<DisplayName>;
}
