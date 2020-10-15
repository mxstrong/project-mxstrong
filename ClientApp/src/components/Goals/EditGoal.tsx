import React, { Dispatch, SetStateAction } from "react";
import {
  IGoalFormData,
  IEditGoalData,
  IEditDayCounterData,
} from "../../helpers/types";
import { FormikHelpers } from "formik";
import GoalForm from "./GoalForm";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../reducers";
import {
  fetchCheckboxes,
  fetchDayCounters,
  fetchProgressBars,
} from "../../actions/goals";
import {
  CHECKBOXES_URL,
  DAY_COUNTERS_URL,
  PROGRESS_BARS_URL,
} from "../../constants/urls";
import { goalTypes } from "../../constants/goalTypes";
import parseISO from "date-fns/parseISO";

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
    startingDate:
      "startingDate" in currentGoal
        ? new Date(parseISO(currentGoal.startingDate))
        : new Date(),
    dayGoal: 0,
  };

  async function handleSubmit(
    values: IGoalFormData,
    { setSubmitting }: FormikHelpers<IGoalFormData>
  ) {
    if (!currentGoal) {
      return;
    }
    let editedGoal: IEditGoalData | null = null;
    let editedDayCounter: IEditDayCounterData | null = null;
    if (values.type === goalTypes.dayCounter) {
      editedDayCounter = {
        goalId: currentGoal.goalId,
        text: values.text,
        startingDate: values.startingDate,
        dayGoal: values.dayGoal,
        parentGoalId: currentGoal.parentGoalId ? currentGoal.parentGoalId : "",
      };
    } else {
      editedGoal = {
        goalId: currentGoal.goalId,
        text: values.text,
        parentGoalId: currentGoal.parentGoalId ? currentGoal.parentGoalId : "",
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

    const response = await fetch(
      url + "/" + (editedGoal ? editedGoal.goalId : editedDayCounter?.goalId),
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedGoal),
      }
    );

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
