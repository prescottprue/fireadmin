import RTDBItem from './connectors/RTDBItem';
import Team from './Team';
import { TeamValue } from './types/Team';
export default class Teams extends RTDBItem {
    constructor();
    path: string;
    create(newTeamData: TeamValue): Promise<Team>;
}
