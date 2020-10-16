import React from "react";
import {
  IGoalFormData,
  IAddGoalData,
  IAddDayCounterData,
} from "../../helpers/types";
import GoalForm from "./GoalForm";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import AuthenticationDialog from "../AuthenticationDialog";
import {
  CHECKBOXES_URL,
  DAY_COUNTERS_URL,
  PROGRESS_BARS_URL,
} from "../../constants/urls";
import { FormikHelpers } from "formik";
import {
  fetchCheckboxes,
  fetchDayCounters,
  fetchProgressBars,
} from "../../actions/goals";
import { goalTypes } from "../../constants/goalTypes";
import formatISO from "date-fns/formatISO";

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
    let goal: IAddGoalData | null = null;
    let dayCounter: IAddDayCounterData | null = null;
    if (values.type === goalTypes.dayCounter) {
      dayCounter = {
        text: values.text,
        parentGoalId: null,
        startingDate: values.startingDate,
        dayGoal: values.dayGoal,
      };
      console.log(dayCounter);
    } else {
      goal = {
        text: values.text,
        parentGoalId: null,
      };
    }

    let url;
    if (values.type === goalTypes.checkbox) {
      url = CHECKBOXES_URL;
    } else if (values.type === goalTypes.progressBar) {
      url = PROGRESS_BARS_URL;
    } else {
      url = DAY_COUNTERS_URL;
    }
    console.log(JSON.stringify(goal ? goal : dayCounter));
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal ? goal : dayCounter),
    });

    if (response.ok) {
      if (values.type === goalTypes.checkbox) {
        dispatch(fetchCheckboxes());
      } else if (values.type === goalTypes.progressBar) {
        dispatch(fetchProgressBars());
      } else {
        dispatch(fetchDayCounters());
      }
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
