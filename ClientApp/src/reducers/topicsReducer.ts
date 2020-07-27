import { IUpdateTopicsAction, ITopic } from "../helpers/types";
import { UPDATE_TOPICS } from "../actions/types";

export const initialState: ITopic[] = [];

export function topicsReducer(
  state = initialState,
  action: IUpdateTopicsAction
) {
  switch (action.type) {
    case UPDATE_TOPICS:
      return Object.assign({}, state, {
        topics: action.topics,
      });
    default:
      return state;
  }
}
