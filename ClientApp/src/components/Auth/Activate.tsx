import React from "react";
import { Paper, Typography, makeStyles } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(1),
    height: "60%",
    flex: "1 0 200px",
  },
  text: {
    textAlign: "center",
    margin: theme.spacing(2),
  },
}));

export default function Activate() {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h6">
        Go to your email to activate your account and complete your
        registration. Already activated your account?
        <Link to="/login">Login</Link>
      </Typography>
    </Paper>
  );
}
