import {
  Box,
  Collapse,
  Divider,
  IconButton,
  LinearProgress,
  LinearProgressProps,
  List,
  ListItem,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGoals, setCurrentGoal } from "../../actions/goals";
import { GOALS_URL } from "../../constants/urls";
import { IGoal } from "../../helpers/types";
import AddSubgoal from "./AddSubgoal";
import EditGoal from "./EditGoal";
import Goal from "./Goal";

const useStyles = makeStyles((theme: Theme) => ({
  nested: {
    paddingLeft: theme.spacing(2),
  },
  menu: {
    boxShadow: "none",
  },
}));

interface IProps {
  goal: IGoal;
}

export default function ProgressBar(props: IProps) {
  const { goal } = props;

  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (!anchorEl) {
      setOpen(!open);
    }
  }

  async function handleEdit(goal: IGoal) {
    async function loadGoal() {
      return dispatch(setCurrentGoal(goal));
    }
    await loadGoal();
    setFormOpen(true);
    handleClose();
  }

  async function handleDelete(goal: IGoal) {
    const response = await fetch(GOALS_URL + "/" + goal.goalId, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchGoals());
    }
    handleClose();
  }

  return (
    <React.Fragment>
      <ListItem button onClick={handleClick}>
        <Typography variant="h6">{goal.text}</Typography>
        <LinearProgressWithLabel value={goal.progress} />
        <IconButton aria-label="settings" onClick={handleOpen}>
          <MoreVertIcon />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          className={classes.menu}
        >
          <MenuItem onClick={() => handleEdit(goal)}>Edit</MenuItem>
          <MenuItem onClick={() => handleDelete(goal)}>Delete</MenuItem>
        </Menu>
        <EditGoal formOpen={formOpen} setFormOpen={setFormOpen} />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List className={classes.nested}>
          {goal.subGoals
            ? goal.subGoals.map((subGoal) => (
                <React.Fragment key={subGoal.goalId}>
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
