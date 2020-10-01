import {
  ListItem,
  FormControlLabel,
  Checkbox,
  IconButton,
  Menu,
  MenuItem,
  makeStyles,
} from "@material-ui/core";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGoals, setCurrentGoal } from "../../actions/goals";
import { GOALS_URL } from "../../constants/urls";
import { IGoal } from "../../helpers/types";
import EditGoal from "./EditGoal";

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    boxShadow: "none",
  },
}));

interface IProps {
  goal: IGoal;
}

export default function CheckBox(props: IProps) {
  const { goal } = props;

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

  function handleClick() {}

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
    <ListItem button onClick={handleClick}>
      <FormControlLabel
        control={<Checkbox checked={goal.progress === 100} color="primary" />}
        label={goal.text}
      />
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
  );
}
