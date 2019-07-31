import { FireadminConfig } from './types/index';
export declare function initialize(fireadminConfig: FireadminConfig): void;
export declare function loginWithToken(customToken: string): Promise<import("firebase").auth.UserCredential>;
import Project from './Project';
import Projects from './Projects';
import Users from './Users';
import User from './User';
export { Projects, Project, Users, User };
export default initialize;
