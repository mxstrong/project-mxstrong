import { UPDATE_GOALS } from "./types";
import { AppThunk, IGoal, IUpdateGoalsAction } from "../helpers/types";
import { Dispatch } from "redux";
import { FETCH_GOALS_URL } from "../constants/urls";

function updateGoals(goals: IGoal[]): IUpdateGoalsAction {
  return {
    type: UPDATE_GOALS,
    payload: goals,
  };
}

export function fetchGoals(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateGoalsAction>) {
    const response = await fetch(FETCH_GOALS_URL, {
      method: "GET",
    });
    if (response.ok) {
      const goals: IGoal[] = await response.json();
      dispatch(updateGoals(goals));
    }
  };
}
