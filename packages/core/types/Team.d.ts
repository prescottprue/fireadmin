import RTDBItem from './connectors/RTDBItem';
import { TeamValue } from './types/Team';
import { GetOptions } from './utils/firebase';
export default class Team extends RTDBItem implements TeamValue {
    id: string;
    path: string;
    constructor(id: string, teamData?: object);
    validate(teamData: TeamValue): void;
    update(teamData: TeamValue): Promise<any>;
    get(options?: GetOptions): Promise<Team>;
}
