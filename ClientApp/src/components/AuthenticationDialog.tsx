import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

interface IProps {
  handleClose: () => void;
  open: boolean;
}

export default function AuthenticationDialog(props: IProps) {
  const { handleClose, open } = props;
  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="authentication-required"
      open={open}
    >
      <DialogTitle>Authentication required</DialogTitle>
      <DialogContent>
        <DialogContentText>You must be logged in to continue</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link to="/login" component={Button} color="primary">
          Login
        </Link>
        <Link to="/register" component={Button} color="primary">
          Register
        </Link>
      </DialogActions>
    </Dialog>
  );
}
