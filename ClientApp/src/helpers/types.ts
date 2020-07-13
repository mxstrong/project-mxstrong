import {
  UPDATE_USER,
  UPDATE_POSTS,
  UPDATE_TOPICS,
  UPDATE_PROFILE,
} from "../actions/types";

export interface IIndexable {
  [key: string]: string;
}

export interface IUserLoginData extends IIndexable {
  email: string;
  password: string;
}

export interface IUpdateUserAction {
  type: typeof UPDATE_USER;
  user: string;
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
}

export interface IUpdateProfileAction {
  type: typeof UPDATE_PROFILE;
  userProfile: IUserProfile;
}

export type AuthActionTypes = IUpdateUserAction | IUpdateProfileAction;

export interface IPost {
  id: string;
  title: string;
  body: string;
  topic: string;
}

export interface IUpdatePostsAction {
  type: typeof UPDATE_POSTS;
  posts: IPost[];
}

export interface ITopic {
  id: string;
  name: string;
}

export interface IUpdateTopicsAction {
  type: typeof UPDATE_TOPICS;
  topics: ITopic[];
}
