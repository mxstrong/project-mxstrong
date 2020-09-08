import { UPDATE_GOALS, SET_CURRENT_GOAL } from "../actions/types";
import { GoalActionTypes, IGoal } from "../helpers/types";

interface IGoalsReducer {
  goals: IGoal[];
  currentGoal: IGoal | null;
}

export const initialState: IGoalsReducer = {
  goals: [],
  currentGoal: null,
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
    default:
      return state;
  }
}
