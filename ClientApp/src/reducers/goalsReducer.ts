import {
  UPDATE_PROGRESS_BARS,
  UPDATE_CHECKBOXES,
  SET_CURRENT_GOAL,
  SET_PARENT_GOAL,
} from "../actions/types";
import { GoalActionTypes, IProgressBar, ICheckbox } from "../helpers/types";

interface IGoalsReducer {
  goals: {
    progressBars: IProgressBar[];
    checkboxes: ICheckbox[];
  };
  currentGoal: IProgressBar | ICheckbox | null;
  parentGoal: IProgressBar | ICheckbox | null;
}

export const initialState: IGoalsReducer = {
  goals: {
    progressBars: [],
    checkboxes: [],
  },
  currentGoal: null,
  parentGoal: null,
};

export function goalsReducer(state = initialState, action: GoalActionTypes) {
  switch (action.type) {
    case UPDATE_PROGRESS_BARS:
      return {
        ...state,
        progressBars: action.payload,
      };
    case UPDATE_CHECKBOXES:
      return {
        ...state,
        checkboxes: action.payload,
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
