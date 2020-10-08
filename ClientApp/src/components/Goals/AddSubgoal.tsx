import React from "react";
import { IGoalFormData, ICheckbox, IProgressBar } from "../../helpers/types";
import GoalForm from "./GoalForm";
import { ListItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import AuthenticationDialog from "../AuthenticationDialog";
import { PROGRESS_BARS_URL, CHECKBOXES_URL } from "../../constants/urls";
import { fetchProgressBars, fetchCheckboxes } from "../../actions/goals";
import { FormikHelpers } from "formik";
import { Redirect } from "react-router-dom";
import { goalTypes } from "../../constants/goalTypes";

interface IProps {
  parentGoal: IProgressBar;
}

export default function AddSubgoal(props: IProps) {
  const { parentGoal } = props;

  const [openAddGoal, setOpenAddGoal] = React.useState(false);
  const [openAuthenticate, setOpenAuthenticate] = React.useState(false);

  const user = useSelector((state: AppState) => state.auth.user);

  const dispatch = useDispatch();

  if (!parentGoal) {
    return <Redirect to="/goals" />;
  }

  const handleClick = () => {
    if (user.userId) {
      setOpenAddGoal(true);
    } else {
      setOpenAuthenticate(true);
    }
  };

  const handleClose = () => {
    setOpenAddGoal(false);
    setOpenAuthenticate(false);
  };

  async function handleSubmit(
    values: IGoalFormData,
    { setSubmitting }: FormikHelpers<IGoalFormData>
  ) {
    if (!parentGoal) {
      return;
    }
    const goal = {
      text: values.text,
      parentGoalId: parentGoal.goalId,
    };

    const url =
      values.type === goalTypes.checkbox ? CHECKBOXES_URL : PROGRESS_BARS_URL;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });

    if (response.ok) {
      values.type === goalTypes.checkbox
        ? dispatch(fetchCheckboxes())
        : dispatch(fetchProgressBars);
    }
    setSubmitting(false);
    handleClose();
  }

  const initialValues = {
    text: "",
    type: "",
    startingDate: new Date(),
    dayGoal: 0,
  };

  const formType = "Add Subgoal";

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        {formType}
        <AddIcon />
      </ListItem>
      <GoalForm
        open={openAddGoal}
        handleClose={handleClose}
        handleSubmit={handleSubmit}
        initialValues={initialValues}
        formType={formType}
      />
      <AuthenticationDialog open={openAuthenticate} handleClose={handleClose} />
    </React.Fragment>
  );
}
