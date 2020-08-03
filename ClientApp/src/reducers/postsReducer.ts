import { IPost, PostActionTypes } from "../helpers/types";
import { UPDATE_POSTS, UPDATE_POST } from "../actions/types";

export const initialState: IPost[] = [];

export function postsReducer(state = initialState, action: PostActionTypes) {
  switch (action.type) {
    case UPDATE_POSTS:
      return action.payload;
    case UPDATE_POST:
      return [...state, action.payload];
    default:
      return state;
  }
}
