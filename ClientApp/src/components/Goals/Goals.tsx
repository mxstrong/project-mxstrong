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
import { fetchCheckboxes, fetchProgressBars } from "../../actions/goals";
import { AppState } from "../../reducers";
import AddGoal from "./AddGoal";
import Goal from "./Goal";

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
        {goals.checkboxes
          ? goals.checkboxes.map((checkbox) => (
              <React.Fragment key={checkbox.goalId}>
                <Goal goal={checkbox} parentGoalId={null} />
                <Divider />
              </React.Fragment>
            ))
          : "There are no goals yet"}
        {goals.progressBars
          ? goals.progressBars.map((progressBar) => (
              <React.Fragment key={progressBar.goalId}>
                <Goal goal={progressBar} parentGoalId={null} />
                <Divider />
              </React.Fragment>
            ))
          : "There are no goals yet"}
      </List>
    </Paper>
  );
}
