import {
  UPDATE_USER,
  UPDATE_POSTS,
  UPDATE_TOPICS,
  UPDATE_POST,
  UPDATE_TOPIC,
  SET_CURRENT_POST,
  UPDATE_COMMENTS,
  UPDATE_PROGRESS_BARS,
  UPDATE_CHECKBOXES,
  SET_CURRENT_GOAL,
  SET_PARENT_GOAL,
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
  payload: IUser;
}

export type IRole = "User" | "Admin" | "";

export interface IUser {
  userId: string;
  fullName: string;
  email: string;
  role: IRole;
}

export interface IPost {
  postId: string;
  title: string;
  body: string;
  topic: string;
  userId: string;
  author: string;
  createdAt: string;
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

export interface IComment {
  commentId: string;
  text: string;
  createdAt: string;
  children: IComment[];
  postId: string;
  userId: string;
  author: string;
  parentId: string;
}

export interface IUpdateCommentsAction {
  type: typeof UPDATE_COMMENTS;
  payload: IComment[];
}

interface IGoal {
  goalId: string;
  text: string;
  userId: string;
  parentGoalId: string | null;
}

export interface ICheckbox extends IGoal {
  checked: boolean;
}

export interface IProgressBar extends IGoal {
  progress: number;
  subGoals: ICheckbox[];
  childBars: IProgressBar[];
}

export interface IGoalFormData extends IIndexable {
  text: string;
  type: string;
}

export interface IAddGoalData extends IGoalFormData {
  parentGoalId: string;
}

export interface IEditGoalData {
  text: string;
  parentGoalId: string;
  userId: string;
  goalId: string;
}

export interface IUpdateProgressBarsAction {
  type: typeof UPDATE_PROGRESS_BARS;
  payload: IProgressBar[];
}

export interface IUpdateCheckboxesAction {
  type: typeof UPDATE_CHECKBOXES;
  payload: ICheckbox[];
}

export interface ISetCurrentGoalAction {
  type: typeof SET_CURRENT_GOAL;
  payload: ICheckbox | IProgressBar;
}

export interface ISetParentGoalAction {
  type: typeof SET_PARENT_GOAL;
  payload: IProgressBar;
}

export type GoalActionTypes =
  | IUpdateProgressBarsAction
  | IUpdateCheckboxesAction
  | ISetCurrentGoalAction
  | ISetParentGoalAction;
