import {
  ListItem,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchCheckboxes, setCurrentGoal } from "../../actions/goals";
import { DAY_COUNTERS_URL } from "../../constants/urls";
import { IDayCounter } from "../../helpers/types";
import EditGoal from "./EditGoal";
import differenceInDays from "date-fns/differenceInDays";
import parseISO from "date-fns/parseISO";

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    boxShadow: "none",
  },
}));

interface IProps {
  dayCounter: IDayCounter;
  parentGoalId: string | null;
}

export default function DayCounter(props: IProps) {
  const { dayCounter, parentGoalId } = props;

  const classes = useStyles();

  const [formOpen, setFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleEdit(dayCounter: IDayCounter) {
    async function loadGoal() {
      return dispatch(setCurrentGoal(dayCounter));
    }
    await loadGoal();
    setFormOpen(true);
    handleClose();
  }

  async function handleDelete(dayCounter: IDayCounter) {
    const response = await fetch(DAY_COUNTERS_URL + "/" + dayCounter.goalId, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchCheckboxes());
    }
    handleClose();
  }

  if (
    dayCounter.parentGoalId !== null &&
    parentGoalId !== dayCounter.parentGoalId
  ) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <ListItem button>
      <Typography variant="h6">
        {dayCounter.text +
          " " +
          differenceInDays(parseISO(dayCounter.startingDate), Date.now()) +
          "/" +
          dayCounter.dayGoal}
      </Typography>
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
        <MenuItem onClick={() => handleEdit(dayCounter)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(dayCounter)}>Delete</MenuItem>
      </Menu>
      <EditGoal formOpen={formOpen} setFormOpen={setFormOpen} />
    </ListItem>
  );
}
