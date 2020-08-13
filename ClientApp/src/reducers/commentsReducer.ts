import { UPDATE_COMMENTS } from "../actions/types";
import { IUpdateCommentsAction, IComment } from "../helpers/types";

interface ICommentsReducer {
  comments: IComment[] | null;
}

export const initialState: ICommentsReducer = {
  comments: null,
};

export function commentsReducer(
  state = initialState,
  action: IUpdateCommentsAction
) {
  switch (action.type) {
    case UPDATE_COMMENTS:
      return { comments: [...action.payload] };
    default:
      return state;
  }
}
