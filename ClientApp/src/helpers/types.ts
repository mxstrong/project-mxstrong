import { UPDATE_USER } from "../actions/types";

export interface IIndexable {
  [key: string]: string;
}

export interface IUserLoginData extends IIndexable {
  email: string;
  password: string;
}

export interface IUpdateUserAction {
  type: string;
  user: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
}

export interface IUpdateProfileAction {
  type: string;
  userProfile: IUserProfile;
}
