import React, { useState } from "react";
import { makeStyles, Paper, Button, Typography } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { IIndexable } from "../helpers/types";
import { CHECK_EMAIL_URL, REGISTER_URL } from "../constants/urls";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";

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

const validateEmail = async (value: string) => {
  let error: string | undefined = undefined;
  console.log(JSON.stringify(value));
  const response = await fetch(CHECK_EMAIL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email: value }),
  });
  if (!response.ok) {
    error = "This email is already taken";
  }
  return error;
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

export default function RegisterForm() {
  const classes = useStyles();
  const [success, setSuccess] = useState(false);

  const register = async (values: IValues) => {
    const user = {
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    };
    const response = await fetch(REGISTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });
    if (response.status === 201) {
      setSuccess(true);
    } else {
      Promise.reject();
    }
  };

  if (success) {
    return <Redirect to="/activate" />;
  }
  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h3">
        Sign Up
      </Typography>
      <Formik
        initialValues={{
          fullName: "",
          email: "",
          password: "",
          passwordRepeat: "",
        }}
        onSubmit={(
          values: IValues,
          { setSubmitting }: FormikHelpers<IValues>
        ) => {
          register(values);
          setSubmitting(false);
        }}
        validate={validate}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <Field
              className={classes.input}
              type="name"
              name="fullName"
              component={TextField}
              label="Full Name"
              variant="outlined"
            />
            <Field
              className={classes.input}
              type="email"
              name="email"
              component={TextField}
              label="Email"
              variant="outlined"
              validate={validateEmail}
            />
            <Field
              className={classes.input}
              type="password"
              name="password"
              component={TextField}
              label="Password"
              variant="outlined"
            />
            <Field
              className={classes.input}
              type="password"
              name="passwordRepeat"
              component={TextField}
              label="Repeat password"
              variant="outlined"
            />
            <Button
              className={classes.button}
              type="submit"
              disabled={isSubmitting}
              variant="contained"
              color="primary"
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
      <Typography className={classes.text} variant="body2">
        Already registered? <Link to="/login">Login</Link>
      </Typography>
    </Paper>
  );
}
