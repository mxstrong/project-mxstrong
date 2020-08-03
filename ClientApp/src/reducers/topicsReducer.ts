import { ITopic, TopicActionTypes } from "../helpers/types";
import { UPDATE_TOPICS, UPDATE_TOPIC } from "../actions/types";

export const initialState: ITopic[] = [];

export function topicsReducer(state = initialState, action: TopicActionTypes) {
  switch (action.type) {
    case UPDATE_TOPICS:
      return [...action.payload];
    case UPDATE_TOPIC:
      return [...state, action.payload];
    default:
      return state;
  }
}
