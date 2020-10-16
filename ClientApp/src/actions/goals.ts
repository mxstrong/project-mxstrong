import {
  SET_CURRENT_GOAL,
  SET_PARENT_GOAL,
  UPDATE_PROGRESS,
  UPDATE_CHECKBOXES,
  UPDATE_DAY_COUNTERS,
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
  IDayCounter,
  IUpdateDayCountersAction,
  IUpdateProgressAction,
} from "../helpers/types";
import { Dispatch } from "redux";
import {
  PROGRESS_BARS_URL,
  CHECKBOXES_URL,
  DAY_COUNTERS_URL,
} from "../constants/urls";

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

function updateDayCounters(
  dayCounters: IDayCounter[]
): IUpdateDayCountersAction {
  return {
    type: UPDATE_DAY_COUNTERS,
    payload: dayCounters,
  };
}

export function setCurrentGoal(
  goal: ICheckbox | IProgressBar | IDayCounter
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

export function updateProgress(): IUpdateProgressAction {
  return {
    type: UPDATE_PROGRESS,
    payload: null,
  };
}

export function fetchProgressBars(): AppThunk {
  return async function (
    dispatch: Dispatch<IUpdateProgressBarsAction | IUpdateProgressAction>
  ) {
    const response = await fetch(PROGRESS_BARS_URL, {
      method: "GET",
    });
    if (response.ok) {
      const progressBars: IProgressBar[] = await response.json();
      dispatch(updateProgressBars(progressBars));
      dispatch(updateProgress());
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

export function fetchDayCounters(): AppThunk {
  return async function (dispatch: Dispatch<IUpdateDayCountersAction>) {
    const response = await fetch(DAY_COUNTERS_URL, {
      method: "GET",
    });
    if (response.ok) {
      const dayCounters: IDayCounter[] = await response.json();
      dispatch(updateDayCounters(dayCounters));
    }
  };
}
