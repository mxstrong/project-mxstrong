import React, { useEffect } from "react";
import {
  Paper,
  makeStyles,
  Theme,
  Typography,
  List,
  Divider,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCheckboxes,
  fetchDayCounters,
  fetchProgressBars,
} from "../../actions/goals";
import { AppState } from "../../reducers";
import AddGoal from "./AddGoal";
import CheckBox from "./CheckBox";
import ProgressBar from "./ProgressBar";
import DayCounter from "./DayCounter";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Goals() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProgressBars());
    dispatch(fetchCheckboxes());
    dispatch(fetchDayCounters());
  }, []);

  const goals = useSelector((state: AppState) => state.goals.goals);
  const user = useSelector((state: AppState) => state.auth.user);

  if (!user.userId) {
    return null;
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Goals</Typography>
      <AddGoal />
      <List>
        {!goals.checkboxes && !goals.progressBars && !goals.dayCounters
          ? "There are no gaols yet."
          : ""}
        {goals.dayCounters
          ? goals.dayCounters.map((dayCounter) => (
              <React.Fragment key={dayCounter.goalId}>
                <DayCounter dayCounter={dayCounter} parentGoalId={null} />
                <Divider />
              </React.Fragment>
            ))
          : ""}
        {goals.checkboxes
          ? goals.checkboxes.map((checkbox) => (
              <React.Fragment key={checkbox.goalId}>
                <CheckBox checkbox={checkbox} parentGoalId={null} />
                <Divider />
              </React.Fragment>
            ))
          : ""}
        {goals.progressBars
          ? goals.progressBars.map((progressBar) => (
              <React.Fragment key={progressBar.goalId}>
                <ProgressBar progressBar={progressBar} parentGoalId={null} />
                <Divider />
              </React.Fragment>
            ))
          : ""}
      </List>
    </Paper>
  );
}
