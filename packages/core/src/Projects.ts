import { PROJECTS_COLLECTION } from './constants/firestorePaths'
import { runValidationForClass } from './utils/validation'
import { ProjectValue } from './types/Project'
import {
  GetOptions,
  snapToItemsArray,
  snapToArray,
  getApp
} from './utils/firebase'
import Project from './Project'

export default class Projects {
  public path?: string
  public ref: firebase.firestore.CollectionReference
  constructor(financialTransactionsData?: object) {
    this.path = PROJECTS_COLLECTION
    this.ref = getApp()
      .firestore()
      .collection(this.path)
    if (financialTransactionsData) {
      Object.assign(this, financialTransactionsData)
    }
  }
  /**
   * Create a new Project
   */
  public async create(newProjectData: ProjectValue): Promise<Project> {
    await runValidationForClass(Project, newProjectData)
    const { id } = await this.ref.add(newProjectData)
    return new Project(id, newProjectData)
  }
  /**
   * Get a list of Projects
   */
  public async get(options?: GetOptions): Promise<Project[] | object[]> {
    const { currentUser } = getApp().auth()
    const ref = currentUser
      ? this.ref.where('createdBy', '==', currentUser.uid)
      : this.ref
    const snap = await ref.get(options)
    if (options && options.json) {
      return snapToArray(snap)
    }
    return snapToItemsArray(
      snap,
      (projectsSnap: firebase.firestore.DocumentData | undefined) => {
        if (projectsSnap) {
          return !projectsSnap.id
            ? projectsSnap.data()
            : new Project(projectsSnap.id, projectsSnap.data())
        }
      }
    )
  }
}
