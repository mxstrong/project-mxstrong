import {
  UPDATE_PROGRESS_BARS,
  UPDATE_CHECKBOXES,
  SET_CURRENT_GOAL,
  SET_PARENT_GOAL,
  UPDATE_DAY_COUNTERS,
} from "../actions/types";
import {
  GoalActionTypes,
  IProgressBar,
  ICheckbox,
  IDayCounter,
} from "../helpers/types";
import { Reducer } from "redux";

interface IGoalsReducer {
  goals: {
    progressBars: IProgressBar[];
    checkboxes: ICheckbox[];
    dayCounters: IDayCounter[];
  };
  currentGoal: IProgressBar | ICheckbox | IDayCounter | null;
  parentGoal: IProgressBar | ICheckbox | IDayCounter | null;
}

export const initialState: IGoalsReducer = {
  goals: {
    progressBars: [],
    checkboxes: [],
    dayCounters: [],
  },
  currentGoal: null,
  parentGoal: null,
};

export const goalsReducer: Reducer<IGoalsReducer, GoalActionTypes> = (
  state = initialState,
  action: GoalActionTypes
) => {
  switch (action.type) {
    case UPDATE_PROGRESS_BARS:
      return {
        ...state,
        goals: {
          ...state.goals,
          progressBars: action.payload,
        },
      };
    case UPDATE_CHECKBOXES:
      return {
        ...state,
        goals: {
          ...state.goals,
          checkboxes: action.payload,
        },
      };
    case UPDATE_DAY_COUNTERS:
      return {
        ...state,
        goals: {
          ...state.goals,
          dayCounters: action.payload,
        },
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
};
