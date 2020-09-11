import React from "react";
import { goalTypes } from "../../constants/goalTypes";
import { IGoal } from "../../helpers/types";
import CheckBox from "./CheckBox";
import ProgressBar from "./ProgressBar";

interface IProps {
  goal: IGoal;
  parentGoalId: string | null;
}

export default function Goal(props: IProps) {
  const { goal, parentGoalId } = props;
  if (goal.parentGoalId !== null && parentGoalId !== goal.parentGoalId) {
    return <React.Fragment></React.Fragment>;
  }
  if (goal.type === goalTypes.progressBar) {
    return <ProgressBar goal={goal} />;
  } else {
    return <CheckBox goal={goal} />;
  }
}
