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
import { fetchCheckboxes, setCurrentGoal } from "../../actions/goals";
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
}

export default function CheckBox(props: IProps) {
  const { checkbox } = props;

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

  return (
    <ListItem button onClick={handleClick}>
      <FormControlLabel
        control={<Checkbox checked={checkbox.checked} color="primary" />}
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
