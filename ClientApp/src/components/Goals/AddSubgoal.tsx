import React from "react";
import {
  IGoalFormData,
  ICheckbox,
  IProgressBar,
  IAddGoalData,
  IAddDayCounterData,
} from "../../helpers/types";
import GoalForm from "./GoalForm";
import { ListItem } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import AuthenticationDialog from "../AuthenticationDialog";
import {
  PROGRESS_BARS_URL,
  CHECKBOXES_URL,
  DAY_COUNTERS_URL,
} from "../../constants/urls";
import {
  fetchProgressBars,
  fetchCheckboxes,
  fetchDayCounters,
} from "../../actions/goals";
import { FormikHelpers } from "formik";
import { Redirect } from "react-router-dom";
import { goalTypes } from "../../constants/goalTypes";
import startOfDay from "date-fns/startOfDay";

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

    let goal: IAddGoalData | null = null;
    let dayCounter: IAddDayCounterData | null = null;
    console.log(values.startingDate);
    if (values.type === goalTypes.dayCounter) {
      dayCounter = {
        text: values.text,
        parentGoalId: parentGoal.goalId,
        startingDate: startOfDay(values.startingDate),
        dayGoal: values.dayGoal,
      };
    } else {
      goal = {
        text: values.text,
        parentGoalId: parentGoal.goalId,
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
