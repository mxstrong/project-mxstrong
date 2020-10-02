import React from "react";
import { goalTypes } from "../../constants/goalTypes";
import { IProgressBar, ICheckbox } from "../../helpers/types";
import CheckBox from "./CheckBox";
import ProgressBar from "./ProgressBar";

interface IProps {
  goal: IProgressBar | ICheckbox;
  parentGoalId: string | null;
}

export default function Goal(props: IProps) {
  const { goal, parentGoalId } = props;
  if (goal.parentGoalId !== null && parentGoalId !== goal.parentGoalId) {
    return <React.Fragment></React.Fragment>;
  }
  if ("progress" in goal) {
    return <ProgressBar progressBar={goal} />;
  } else {
    return <CheckBox checkbox={goal} />;
  }
}
