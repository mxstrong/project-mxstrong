import { UPDATE_GOALS } from "../actions/types";
import { IUpdateGoalsAction, IGoal } from "../helpers/types";

interface IGoalsReducer {
  goals: IGoal[];
}

export const initialState: IGoalsReducer = {
  goals: [],
};

export function goalsReducer(state = initialState, action: IUpdateGoalsAction) {
  switch (action.type) {
    case UPDATE_GOALS:
      return {
        goals: action.payload,
      };
  }
}
