import React from "react";
import {
  makeStyles,
  Paper,
  TextField,
  Button,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { renderTextField } from "../helpers/formHelpers";
import { IIndexable } from "../helpers/types";

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
    height: "60%",
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

const validate = (values: IValues) => {
  const errors: IErrors = {};
  const requiredFields: string[] = ["email", "password"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }
  return errors;
};

interface IValues extends IIndexable {
  email: string;
  password: string;
}

type IErrors = IIndexable & {
  email?: string;
  password?: string;
};

function LoginForm(props: InjectedFormProps<IValues, {}>) {
  const classes = useStyles();
  const { handleSubmit, pristine, submitting } = props;
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h3">
        Sign In
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          className={classes.input}
          name="email"
          component={renderTextField}
          label="Email"
          variant="outlined"
        />
        <Field
          className={classes.input}
          name="password"
          component={renderTextField}
          label="Password"
          variant="outlined"
        />
        <Button
          className={classes.button}
          type="submit"
          variant="contained"
          color="primary"
        >
          Login
        </Button>
      </form>
      <Typography className={classes.text} variant="body2">
        Not our user yet? <Link to="/register">Register</Link>
      </Typography>
    </Paper>
  );
}

export default reduxForm({
  form: "LoginForm",
  validate,
})(LoginForm);
