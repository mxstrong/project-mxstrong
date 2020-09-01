import React from "react";
import {
  AppBar,
  makeStyles,
  Theme,
  Typography,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../reducers";
import { useCookies } from "react-cookie";
import { logoutUser } from "../actions";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    flexGrow: 0.2,
    margin: theme.spacing(3),
  },
  menuItem: {
    flexGrow: 0.2,
    fontSize: "20px",
  },
  loginButton: {
    flexGrow: 0.2,
    fontSize: "24px",
  },
}));

export default function Header() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);

  function handleLogout() {
    dispatch(logoutUser());
  }

  function renderLoginButton() {
    if (user.userId) {
      return <Button onClick={handleLogout}>Logout</Button>;
    } else {
      return (
        <Link
          color="inherit"
          className={classes.loginButton}
          to="/login"
          component={Button}
        >
          Login
        </Link>
      );
    }
  }
  return (
    <AppBar position="static" className={classes.header}>
      <Typography variant="h4" className={classes.title}>
        Project Mxstrong
      </Typography>
      <Link
        color="inherit"
        className={classes.menuItem}
        to="/"
        component={Button}
      >
        Home
      </Link>
      {renderLoginButton()}
    </AppBar>
  );
}
