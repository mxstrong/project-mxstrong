import { IPostsReducer, PostActionTypes } from "../helpers/types";
import {
  UPDATE_POSTS,
  UPDATE_POST,
  SET_CURRENT_POST,
  UPDATE_COMMENTS,
} from "../actions/types";
import { Reducer } from "redux";

export const initialState = {
  posts: [],
  currentPost: null,
};

export const postsReducer: Reducer<IPostsReducer, PostActionTypes> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case UPDATE_POSTS:
      return { ...state, posts: action.payload };
    case UPDATE_POST:
      return { ...state, posts: [...state.posts, action.payload] };
    case SET_CURRENT_POST:
      return { ...state, currentPost: action.payload };
    default:
      return state;
  }
};
