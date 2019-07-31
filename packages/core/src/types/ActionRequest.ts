import { ActionSettings } from './Action'
import { ActionTemplateValue } from './ActionTemplate';

/**
 * Value representing an Action (used by actionRunner cloud function).
 */
export interface ActionRequestValue extends ActionSettings {
  exists?: boolean
  snap?: firebase.firestore.DocumentSnapshot
  name?: string
  description?: string
  createdBy?: string
  templateId?: string
  template?: ActionTemplateValue
  inputValues?: string[]
  environmentValues?: string[]
  createdAt?: firebase.firestore.FieldValue
  updatedAt?: firebase.firestore.FieldValue
}