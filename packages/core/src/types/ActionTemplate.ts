/**
 * Value representing a ActionTemplate.
 */

export interface ActionTemplateValue {
  createdAt?: number;
  createdBy?: string;
  name?: string;
  public?: boolean;
  subcollections?: boolean;
  environments?: any[];
  steps?: any[];
  inputs?: any[];
  [k: string]: any;
}
