import React, { useEffect } from "react";
import {
  Paper,
  makeStyles,
  Theme,
  Typography,
  LinearProgressProps,
  LinearProgress,
  Box,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { fetchGoals } from "../../actions/goals";
import { AppState } from "../../reducers";
import { IGoal } from "../../helpers/types";
import AddGoal from "./AddGoal";

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

  function handleCheck(event: React.ChangeEvent<HTMLInputElement>) {}

  function renderGoals(goals: IGoal[], parentId: string | null = null) {
    return goals.length > 0
      ? goals.map((goal) => {
          if (goal.parentGoalId !== null && goal.parentGoalId !== parentId) {
            return;
          }
          if (goal.type === "ProgressBar") {
            return (
              <React.Fragment>
                <Typography variant="h6">{goal.text}</Typography>
                <LinearProgressWithLabel value={goal.progress} />
                {renderGoals(goal.subGoals, goal.goalId)}
              </React.Fragment>
            );
          }
          if (goal.type === "CheckBox") {
            return (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={goal.progress === 100}
                    color="primary"
                    onChange={handleCheck}
                  />
                }
                label={goal.text}
              />
            );
          }
        })
      : "";
  }

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Goals</Typography>
      <AddGoal />
      {goals.length > 0 ? renderGoals(goals) : "There are no goals yet"}
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
