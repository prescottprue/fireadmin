import { GetOptions } from './utils/firebase';
import { ActionRequestValue } from './types/ActionRequest';
import { ActionInputSetting, ActionStepSetting, ActionEnvironmentSetting } from './types/Action';
import RTDBItem from './connectors/RTDBItem';
export default class ActionRequest extends RTDBItem {
    id?: string;
    environments?: ActionEnvironmentSetting[];
    inputs?: ActionInputSetting[];
    steps?: ActionStepSetting[];
    constructor(actionId?: string, actionData?: Partial<ActionRequestValue>);
    validate(actionData: ActionRequestValue): void;
    create(newActionData: ActionRequestValue): Promise<ActionRequest>;
    get(options?: GetOptions): Promise<ActionRequest>;
    update(actionData: ActionRequestValue): Promise<ActionRequest>;
}
