import {
  Box,
  Collapse,
  Divider,
  LinearProgress,
  LinearProgressProps,
  List,
  ListItem,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";
import { IGoal } from "../../helpers/types";
import AddSubgoal from "./AddSubgoal";
import Goal from "./Goal";

const useStyles = makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(2),
  },
}));

interface IProps {
  goal: IGoal;
}

export default function ProgressBar(props: IProps) {
  const { goal } = props;

  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <Typography variant="h6">{goal.text}</Typography>
        <LinearProgressWithLabel value={goal.progress} />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.nested}>
          {goal.subGoals
            ? goal.subGoals.map((subGoal) => (
                <React.Fragment>
                  <Goal goal={subGoal} parentGoalId={goal.goalId} />
                  <Divider />
                </React.Fragment>
              ))
            : ""}
          <AddSubgoal parentGoal={goal} />
        </List>
      </Collapse>
    </React.Fragment>
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
