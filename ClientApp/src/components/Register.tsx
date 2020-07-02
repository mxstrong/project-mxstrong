import React from "react";
import {
  makeStyles,
  Paper,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import { Field, reduxForm } from "redux-form";
import { renderTextField } from "../helpers/formHelpers";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: "80%",
    margin: theme.spacing(1),
  },
  paper: {
    padding: theme.spacing,
    height: "70%",
    flex: "1 0 200px",
  },
  text: {
    textAlign: "center",
    margin: theme.spacing(2),
  },
  button: {
    width: "80%",
  },
}));

function Register() {
  const classes = useStyles();
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h3">
        Sign Up
      </Typography>
      <form className={classes.form}>
        <Field
          className={classes.input}
          name="fullName"
          component={renderTextField}
          label="Full Name"
          variant="outlined"
        />
        <TextField className={classes.input} label="Email" variant="outlined" />
        <TextField
          className={classes.input}
          label="Password"
          variant="outlined"
        />
        <TextField
          className={classes.input}
          label="Repeat password"
          variant="outlined"
        />
        <Button className={classes.button} variant="contained" color="primary">
          Register
        </Button>
      </form>
      <Typography className={classes.text} variant="body2">
        Already registered? <Link to="/login">Login</Link>
      </Typography>
    </Paper>
  );
}

export default reduxForm({
  form: "RegisterForm",
})(Register);
