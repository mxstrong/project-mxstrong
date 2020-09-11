import React from "react";
import { IGoalFormData, IGoal } from "../../helpers/types";
import GoalForm from "./GoalForm";
import { Button, ListItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import AuthenticationDialog from "../AuthenticationDialog";
import { GOALS_URL } from "../../constants/urls";
import { fetchGoals, setParentGoal } from "../../actions/goals";
import { FormikHelpers } from "formik";
import { Redirect } from "react-router-dom";

interface IProps {
  parentGoal: IGoal;
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
      ...values,
      parentGoalId: parentGoal.goalId,
    };
    const response = await fetch(GOALS_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });

    if (response.ok) {
      dispatch(fetchGoals());
    }
    setSubmitting(false);
    handleClose();
  }

  const initialValues = {
    text: "",
    type: "",
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
