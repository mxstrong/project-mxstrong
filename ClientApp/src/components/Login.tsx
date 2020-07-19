import React from "react";
import { makeStyles, Paper, Button, Typography } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { renderTextField } from "../helpers/formHelpers";
import { IIndexable, IUserLoginData } from "../helpers/types";
import { loginUser } from "../actions";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";

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
    padding: theme.spacing(1),
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

const validate = (values: IUserLoginData) => {
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

type IErrors = IIndexable & {
  email?: string;
  password?: string;
};

function LoginForm(props: InjectedFormProps<IUserLoginData, {}>) {
  const classes = useStyles();
  const { handleSubmit, pristine, submitting } = props;
  const user = useSelector((state: AppState) => state.auth.user);

  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h3">
        Sign In
      </Typography>
      <form
        className={classes.form}
        onSubmit={handleSubmit((values, dispatch) => {
          dispatch(loginUser(values));
        })}
      >
        <Field
          className={classes.input}
          type="email"
          name="email"
          component={renderTextField}
          label="Email"
          variant="outlined"
        />
        <Field
          className={classes.input}
          type="password"
          name="password"
          component={renderTextField}
          label="Password"
          variant="outlined"
        />
        <Button
          className={classes.button}
          type="submit"
          disabled={pristine || submitting}
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
