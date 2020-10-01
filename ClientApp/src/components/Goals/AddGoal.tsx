import React from "react";
import { IIndexable, IGoalFormData } from "../../helpers/types";
import GoalForm from "./GoalForm";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import AuthenticationDialog from "../AuthenticationDialog";
import { GOALS_URL } from "../../constants/urls";
import { fetchGoals } from "../../actions/goals";
import { FormikHelpers } from "formik";

export default function AddGoal() {
  const [openAddGoal, setOpenAddGoal] = React.useState(false);
  const [openAuthenticate, setOpenAuthenticate] = React.useState(false);

  const user = useSelector((state: AppState) => state.auth.user);

  const dispatch = useDispatch();

  const handleClickOpen = () => {
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
    const goal = {
      ...values,
      parentGoalId: null,
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

  const formType = "Add New Goal";

  return (
    <React.Fragment>
      <Fab color="primary" variant="extended" onClick={handleClickOpen}>
        {formType}
        <AddIcon />
      </Fab>
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
