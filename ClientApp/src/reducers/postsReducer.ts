import { IUpdatePostsAction, IPost } from "../helpers/types";
import { UPDATE_POSTS } from "../actions/types";

export const initialState: IPost[] = [];

export function postsReducer(state = initialState, action: IUpdatePostsAction) {
  switch (action.type) {
    case UPDATE_POSTS:
      return Object.assign({}, state, {
        posts: action.posts,
      });
    default:
      return state;
  }
}
