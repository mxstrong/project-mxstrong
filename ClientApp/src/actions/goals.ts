import {
  SET_CURRENT_GOAL,
  SET_PARENT_GOAL,
  UPDATE_CHECKBOXES,
  UPDATE_PROGRESS_BARS,
} from "./types";
import {
  AppThunk,
  IProgressBar,
  ICheckbox,
  IUpdateProgressBarsAction,
  IUpdateCheckboxesAction,
  ISetCurrentGoalAction,
  ISetParentGoalAction,
} from "../helpers/types";
import { Dispatch } from "redux";
import { PROGRESS_BARS_URL, CHECKBOXES_URL } from "../constants/urls";

function updateProgressBars(
  progressBars: IProgressBar[]
): IUpdateProgressBarsAction {
  return {
    type: UPDATE_PROGRESS_BARS,
    payload: progressBars,
  };
}

function updateCheckboxes(checkboxes: ICheckbox[]): IUpdateCheckboxesAction {
  return {
    type: UPDATE_CHECKBOXES,
    payload: checkboxes,
  };
}

export function setCurrentGoal(
  goal: ICheckbox | IProgressBar
): ISetCurrentGoalAction {
  return {
    type: SET_CURRENT_GOAL,
    payload: goal,
  };
}

export function setParentGoal(goal: IProgressBar): ISetParentGoalAction {
  return {
    type: SET_PARENT_GOAL,
    payload: goal,
  };
}

export function fetchProgressBars(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateProgressBarsAction>) {
    const response = await fetch(PROGRESS_BARS_URL, {
      method: "GET",
    });
    if (response.ok) {
      const progressBars: IProgressBar[] = await response.json();
      dispatch(updateProgressBars(progressBars));
    }
  };
}

export function fetchCheckboxes(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateCheckboxesAction>) {
    const response = await fetch(CHECKBOXES_URL, {
      method: "GET",
    });
    if (response.ok) {
      const checkboxes: ICheckbox[] = await response.json();
      dispatch(updateCheckboxes(checkboxes));
    }
  };
}
