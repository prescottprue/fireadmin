/* tslint:disable */
/**
 * Value representing a User.
 */

export interface UserValue {
  avatarUrl?: string;
  displayName?: string;
  email?: string;
  providerData?: {
    displayName?: string;
    email?: string;
    photoURL?: string;
    providerId?: string;
    uid?: string;
    [k: string]: any;
  }[];
  [k: string]: any;
}
