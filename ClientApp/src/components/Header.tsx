import React from "react";
import {
  AppBar,
  makeStyles,
  Theme,
  Typography,
  Button,
} from "@material-ui/core";
import { Link } from "react-router-dom";

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
      <Link
        color="inherit"
        className={classes.loginButton}
        to="/login"
        component={Button}
      >
        Login
      </Link>
    </AppBar>
  );
}
