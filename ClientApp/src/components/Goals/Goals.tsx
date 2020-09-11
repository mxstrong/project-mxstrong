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
import { fetchGoals } from "../../actions/goals";
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
    dispatch(fetchGoals());
  }, []);

  const goals = useSelector((state: AppState) => state.goals.goals);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Goals</Typography>
      <AddGoal />
      <List>
        {goals
          ? goals.map((goal) => (
              <React.Fragment>
                <Goal goal={goal} parentGoalId={null} />
                <Divider />
              </React.Fragment>
            ))
          : "There are no goals yet"}
      </List>
    </Paper>
  );
}
