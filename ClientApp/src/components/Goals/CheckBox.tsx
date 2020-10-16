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
import {
  fetchCheckboxes,
  fetchProgressBars,
  setCurrentGoal,
  updateProgress,
} from "../../actions/goals";
import { CHECKBOXES_URL } from "../../constants/urls";
import { ICheckbox } from "../../helpers/types";
import EditGoal from "./EditGoal";

const useStyles = makeStyles((theme: Theme) => ({
  menu: {
    boxShadow: "none",
  },
}));

interface IProps {
  checkbox: ICheckbox;
  parentGoalId: string | null;
}

export default function CheckBox(props: IProps) {
  const { checkbox, parentGoalId } = props;

  const classes = useStyles();

  const [checked, setChecked] = useState(checkbox.checked);
  const [formOpen, setFormOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const dispatch = useDispatch();

  function handleOpen(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleClick() {
    const result = await fetch(CHECKBOXES_URL + "/check/" + checkbox.goalId, {
      method: "POST",
    });
    if (result.ok) {
      dispatch(fetchCheckboxes());
      dispatch(fetchProgressBars());
      setChecked(!checked);
    }
  }

  async function handleEdit(checkbox: ICheckbox) {
    async function loadGoal() {
      return dispatch(setCurrentGoal(checkbox));
    }
    await loadGoal();
    setFormOpen(true);
    handleClose();
  }

  async function handleDelete(checkbox: ICheckbox) {
    const response = await fetch(CHECKBOXES_URL + "/" + checkbox.goalId, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchCheckboxes());
    }
    handleClose();
  }

  if (
    checkbox.parentGoalId !== null &&
    parentGoalId !== checkbox.parentGoalId
  ) {
    return <React.Fragment></React.Fragment>;
  }

  return (
    <ListItem button onClick={handleClick}>
      <FormControlLabel
        control={<Checkbox checked={checked} color="primary" />}
        label={checkbox.text}
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
        <MenuItem onClick={() => handleEdit(checkbox)}>Edit</MenuItem>
        <MenuItem onClick={() => handleDelete(checkbox)}>Delete</MenuItem>
      </Menu>
      <EditGoal formOpen={formOpen} setFormOpen={setFormOpen} />
    </ListItem>
  );
}
