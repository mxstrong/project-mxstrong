import React from "react";
import { makeStyles, Paper, Button, Typography } from "@material-ui/core";
import { Field, reduxForm, InjectedFormProps } from "redux-form";
import { renderTextField } from "../helpers/formHelpers";
import { Link } from "react-router-dom";
import { IIndexable } from "../helpers/types";
import { CHECK_EMAIL_URL } from "../constants/urls";

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
    height: "80%",
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

interface IValues extends IIndexable {
  fullName: string;
  email: string;
  password: string;
  passwordRepeat: string;
}

type IErrors = IIndexable & {
  fullName?: string;
  email?: string;
  password?: string;
  passwordRepeat?: string;
};

const asyncValidate = async (values: IValues) => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch(CHECK_EMAIL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values.email),
    });
    if (!response.ok) {
      reject({ email: "This email is already taken" });
    }
    resolve();
  });
};

const validate = (values: IValues) => {
  const errors: IErrors = {};
  const requiredFields: string[] = [
    "fullName",
    "email",
    "password",
    "passwordRepeat",
  ];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (values.password != values.passwordRepeat) {
    errors.password = "Passwords are not matching";
    errors.passwordRepeat = errors.password;
  }

  if (
    values.email &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
  ) {
    errors.email = "Invalid email address";
  }
  return errors;
};

function RegisterForm(props: InjectedFormProps<IValues, {}>) {
  const classes = useStyles();
  const { handleSubmit, pristine, submitting } = props;
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h3">
        Sign Up
      </Typography>
      <form className={classes.form} onSubmit={handleSubmit}>
        <Field
          className={classes.input}
          type="name"
          name="fullName"
          component={renderTextField}
          label="Full Name"
          variant="outlined"
        />
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
        <Field
          className={classes.input}
          type="password"
          name="passwordRepeat"
          component={renderTextField}
          label="Repeat password"
          variant="outlined"
        />
        <Button
          className={classes.button}
          type="submit"
          disabled={pristine || submitting}
          variant="contained"
          color="primary"
        >
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
  validate,
  asyncValidate,
})(RegisterForm);
