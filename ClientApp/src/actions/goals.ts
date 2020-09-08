import { UPDATE_GOALS, SET_CURRENT_GOAL } from "./types";
import {
  AppThunk,
  IGoal,
  IUpdateGoalsAction,
  ISetCurrentGoalAction,
  IAddGoalData,
} from "../helpers/types";
import { Dispatch } from "redux";
import { GOALS_URL } from "../constants/urls";

function updateGoals(goals: IGoal[]): IUpdateGoalsAction {
  return {
    type: UPDATE_GOALS,
    payload: goals,
  };
}

export function setCurrentGoal(goal: IGoal): ISetCurrentGoalAction {
  return {
    type: SET_CURRENT_GOAL,
    payload: goal,
  };
}

export function fetchGoals(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateGoalsAction>) {
    const response = await fetch(GOALS_URL, {
      method: "GET",
    });
    if (response.ok) {
      const goals: IGoal[] = await response.json();
      dispatch(updateGoals(goals));
    }
  };
}
