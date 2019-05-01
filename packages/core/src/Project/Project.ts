import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { PROJECTS_PATH } from './constants/firebasePaths';
import { ProjectValue } from './ProjectValue'

/**
 * Fireadmin Project
 */
export default class Project {
  constructor(projectId: string) {
    this.id = projectId
    this.path = `${PROJECTS_PATH}/${projectId}`
    this.ref = firebase.firestore().doc(this.path)
    this.listen = this.ref.onSnapshot
  }
  path: string
  id: string
  ref: firebase.firestore.DocumentReference
  listen: any

  /**
   * Get Project value of Fireadmin project
   */
  get(): Promise<ProjectValue> {
    return this.ref.get().then((docSnap) => {
      return new ProjectValue(docSnap)
    })
  }

  update(values: Object): Promise<any> {
    return this.ref.update(values)
  }

  delete() {
    return this.ref.delete()
  }

  validate() {

  }
}