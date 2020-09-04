import React, { useEffect } from "react";
import {
  Paper,
  makeStyles,
  Theme,
  Typography,
  LinearProgressProps,
  LinearProgress,
  Box,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoals } from "../../actions/goals";
import { AppState } from "../../reducers";
import { IGoal } from "../../helpers/types";

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
    dispatch(fetchGoals());
  }, []);

  const goals = useSelector((state: AppState) => state.goals.goals);

  function renderGoals(goals: IGoal[], parentId: string | null = null) {
    return goals.map((goal) => {
      if (goal.parentGoalId !== null && goal.parentGoalId !== parentId) {
        return;
      }
      return (
        <React.Fragment>
          <Typography variant="h6">{goal.text}</Typography>
          <LinearProgressWithLabel value={goal.progress} />
          {renderGoals(goal.subGoals, goal.goalId)}
        </React.Fragment>
      );
    });
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Goals</Typography>
      {renderGoals(goals)}
    </Paper>
  );
}

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box display="flex" alignItems="center">
      <Box width="100%" mr={1}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box minWidth={35}>
        <Typography variant="body2" color="textSecondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
