import React from "react";
import {
  AppBar,
  makeStyles,
  Theme,
  Typography,
  Button,
  fade,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../reducers";
import { logoutUser } from "../actions/auth";

const useStyles = makeStyles((theme: Theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  homeLink: {
    color: "#ffffff",
    textDecoration: "none",
    "&:hover": {
      backgroundColor: fade(
        theme.palette.text.primary,
        theme.palette.action.hoverOpacity
      ),
      "@media (hover: none)": {
        backgroundColor: "transparent",
      },
      "&$disabled": {
        backgroundColor: "transparent",
      },
    },
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
      <Link color="inherit" className={classes.homeLink} to="/">
        <Typography variant="h4" className={classes.title}>
          Project Mxstrong
        </Typography>
      </Link>
      <Link
        color="inherit"
        className={classes.menuItem}
        to="/posts"
        component={Button}
      >
        Posts
      </Link>
      {user.userId ? (
        <Link
          color="inherit"
          className={classes.menuItem}
          to="/goals"
          component={Button}
        >
          Goals
        </Link>
      ) : (
        ""
      )}
      {renderLoginButton()}
    </AppBar>
  );
}
