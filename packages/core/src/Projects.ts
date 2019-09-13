import { PROJECTS_COLLECTION } from './constants/firestorePaths'
import { runValidationForClass } from './utils/validation'
import { ProjectValue } from './types/Project'
import {
  GetOptions,
  getApp
} from './utils/firebase'
import Project from './Project'
import { to } from './utils/async'

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
  public async get(options?: GetOptions): Promise<Project[] | any[]> {
    const { currentUser } = getApp().auth()
    const userCollabProjectsRef = currentUser
    ? this.ref.where(`collaborators.${currentUser.uid}`, '==', true)
    : this.ref
    const currentUserProjectsRef = currentUser
      ? this.ref.where('createdBy', '==', currentUser.uid)
      : this.ref
    
    const [getDataErr, snaps] = await to(
      Promise.all([
        currentUserProjectsRef.get(options),
        userCollabProjectsRef.get(options)
      ])
    )

    if (getDataErr) {
      console.error('Error getting projects', getDataErr)
      throw new Error('Error getting projects')
    }

    if (!snaps) {
      throw new Error('No project snaps found')
    }

    const [usersProjectsSnap, collabProjectsSnap] = snaps
    const projects = [ ...(usersProjectsSnap.docs || []), ...(collabProjectsSnap.docs || [])]

    if (options && options.json) {
      return projects
    }
    return projects.reduce((acc: any[], projectSnap: firebase.firestore.QueryDocumentSnapshot) => {
      if (projectSnap) {
        return !projectSnap.id
          ? [ ...acc, projectSnap.data()]
          : [...acc, new Project(projectSnap.id, projectSnap.data())]
      }
      return acc
    }, [])
  }
}
