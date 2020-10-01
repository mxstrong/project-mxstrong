import React, { Dispatch, SetStateAction } from "react";
import { IGoalFormData, IEditGoalData } from "../../helpers/types";
import { FormikHelpers } from "formik";
import GoalForm from "./GoalForm";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../reducers";
import { fetchGoals } from "../../actions/goals";
import { GOALS_URL } from "../../constants/urls";

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
    type: currentGoal.type,
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
      type: values.type,
      parentGoalId: currentGoal.parentGoalId ? currentGoal.parentGoalId : "",
    };

    const response = await fetch(GOALS_URL + "/" + editedGoal.goalId, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(editedGoal),
    });

    if (response.ok) {
      dispatch(fetchGoals());
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
