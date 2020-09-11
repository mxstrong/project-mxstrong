import {
  UPDATE_GOALS,
  SET_CURRENT_GOAL,
  SET_PARENT_GOAL,
} from "../actions/types";
import { GoalActionTypes, IGoal } from "../helpers/types";

interface IGoalsReducer {
  goals: IGoal[];
  currentGoal: IGoal | null;
  parentGoal: IGoal | null;
}

export const initialState: IGoalsReducer = {
  goals: [],
  currentGoal: null,
  parentGoal: null,
};

export function goalsReducer(state = initialState, action: GoalActionTypes) {
  switch (action.type) {
    case UPDATE_GOALS:
      return {
        ...state,
        goals: action.payload,
      };
    case SET_CURRENT_GOAL:
      return {
        ...state,
        currentGoal: action.payload,
      };
    case SET_PARENT_GOAL:
      return {
        ...state,
        parentGoal: action.payload,
      };
    default:
      return state;
  }
}
