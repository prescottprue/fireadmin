import * as firebase from 'firebase/app'
import { ACTION_TEMPLATES_COLLECTION } from './constants/firestorePaths'
import { runValidationForClass } from './utils/validation'
import { ActionTemplateValue } from './types/ActionTemplate'
import {
  GetOptions,
  snapToItemsArray,
  getApp,
  snapToArray
} from './utils/firebase'
import ActionTemplate from './ActionTemplate'

export default class ActionTemplates {
  public path?: string
  public ref: firebase.firestore.CollectionReference
  constructor(templateData?: object) {
    this.path = ACTION_TEMPLATES_COLLECTION
    this.ref = getApp()
      .firestore()
      .collection(ACTION_TEMPLATES_COLLECTION)
    if (templateData) {
      Object.assign(this, templateData)
    }
  }
  /**
   * Create a new ActionTemplate
   */
  public async create(
    newTemplateData: ActionTemplateValue
  ): Promise<ActionTemplate> {
    await runValidationForClass(ActionTemplate, newTemplateData)
    const { id } = await this.ref.add(newTemplateData)
    return new ActionTemplate(id, newTemplateData)
  }

  /**
   * Get a list of ActionTemplates
   */
  public async get(options?: GetOptions): Promise<ActionTemplate[] | object[]> {
    const snap = await this.ref.where('public', '==', true).get(options)
    if (options && options.json) {
      return snapToArray(snap)
    }
    return snapToItemsArray(
      snap,
      (projectsSnap: firebase.firestore.DocumentData | undefined) => {
        if (projectsSnap) {
          return !projectsSnap.id
            ? projectsSnap.data()
            : new ActionTemplate(projectsSnap.id, projectsSnap.data())
        }
      }
    )
  }
}
