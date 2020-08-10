import {
  UPDATE_USER,
  UPDATE_POSTS,
  UPDATE_TOPICS,
  UPDATE_PROFILE,
  UPDATE_POST,
  UPDATE_TOPIC,
  SET_CURRENT_POST,
} from "../actions/types";
import { ThunkAction } from "redux-thunk";
import { AppState } from "../reducers";
import { Action } from "redux";

export interface IIndexable {
  [key: string]: string;
}

export interface IUserLoginData extends IIndexable {
  email: string;
  password: string;
}

export interface IUpdateUserAction {
  type: typeof UPDATE_USER;
  payload: string;
}

export interface IUserProfile {
  userId: string;
  fullName: string;
  email: string;
}

export interface IUpdateProfileAction {
  type: typeof UPDATE_PROFILE;
  payload: IUserProfile;
}

export type AuthActionTypes = IUpdateUserAction | IUpdateProfileAction;

export interface IPost {
  postId: string;
  title: string;
  body: string;
  topic: string;
  userId: string;
}

export interface IUpdatePostsAction {
  type: typeof UPDATE_POSTS;
  payload: IPost[];
}

export interface ITopic {
  topicId: string;
  name: string;
}

export interface IUpdateTopicsAction {
  type: typeof UPDATE_TOPICS;
  payload: ITopic[];
}

export interface IPostFormData extends IIndexable {
  title: string;
  topic: string;
  otherTopic: string;
  body: string;
}

export interface IEditPostData extends IPost {
  otherTopic: string;
  userId: string;
}

export interface IAddPostAction {
  type: typeof UPDATE_POST;
  payload: IPost;
}

export interface IAddTopicAction {
  type: typeof UPDATE_TOPIC;
  payload: ITopic;
}

export type PostActionTypes =
  | IUpdatePostsAction
  | IAddPostAction
  | ISetCurrentPostAction;
export type TopicActionTypes = IUpdateTopicsAction | IAddTopicAction;

export interface ISetCurrentPostAction {
  type: typeof SET_CURRENT_POST;
  payload: IPost;
}

export interface IPostsReducer {
  posts: IPost[];
  currentPost: IPost | null;
}

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;
