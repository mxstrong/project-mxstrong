import React, { Dispatch, SetStateAction } from "react";
import { IGoalFormData, IEditGoalData } from "../../helpers/types";
import { FormikHelpers } from "formik";
import GoalForm from "./GoalForm";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../reducers";
import { fetchCheckboxes, fetchProgressBars } from "../../actions/goals";
import { CHECKBOXES_URL, PROGRESS_BARS_URL } from "../../constants/urls";
import { goalTypes } from "../../constants/goalTypes";

interface IProps {
  formOpen: boolean;
  setFormOpen: Dispatch<SetStateAction<boolean>>;
}

export default function EditGoal(props: IProps) {
  const { formOpen, setFormOpen } = props;

  const currentGoal = useSelector((state: AppState) => state.goals.currentGoal);

  const dispatch = useDispatch();

  if (!currentGoal) {
    return <React.Fragment></React.Fragment>;
  }

  const handleClose = () => {
    setFormOpen(false);
  };

  const initialValues = {
    text: currentGoal.text,
    type: "checked" in currentGoal ? goalTypes.checkbox : "Progress bar",
  };

  async function handleSubmit(
    values: IGoalFormData,
    { setSubmitting }: FormikHelpers<IGoalFormData>
  ) {
    if (!currentGoal) {
      return;
    }
    const editedGoal: IEditGoalData = {
      goalId: currentGoal.goalId,
      text: values.text,
      userId: currentGoal.userId,
      parentGoalId: currentGoal.parentGoalId ? currentGoal.parentGoalId : "",
    };

    const url =
      values.type === goalTypes.checkbox ? CHECKBOXES_URL : PROGRESS_BARS_URL;

    const response = await fetch(url + "/" + editedGoal.goalId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedGoal),
    });

    if (response.ok) {
      values.type === goalTypes.checkbox
        ? dispatch(fetchCheckboxes())
        : dispatch(fetchProgressBars);
    }
    setSubmitting(false);
    handleClose();
  }

  const formType = "Edit Goal";

  return (
    <React.Fragment>
      <GoalForm
        open={formOpen}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        formType={formType}
      />
    </React.Fragment>
  );
}
