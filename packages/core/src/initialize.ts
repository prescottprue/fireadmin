import { FB_CONFIG_BY_ENV_NAMES } from './constants/fbConfigs'
import { init } from './utils/firebase'

export type EnvironmentName = 'stage' | 'prod'

/**
 * Initialize Fireadmin library
 * @param envName - Name of the Fireadmin environment
 */
export default function initialize(envName: EnvironmentName) {
  init(FB_CONFIG_BY_ENV_NAMES[envName])
}
