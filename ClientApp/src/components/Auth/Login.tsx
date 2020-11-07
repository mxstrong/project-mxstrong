import React from "react";
import { makeStyles, Paper, Button, Typography } from "@material-ui/core";
import { Link, Redirect } from "react-router-dom";
import { IIndexable, IUserLoginData } from "../../helpers/types";
import { loginUser, loginWithGoogle } from "../../actions/auth";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../../reducers";
import { Field, Form, Formik, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";
import GoogleLogin from "react-google-login";
import { clientId } from "../../constants/googleClientId";

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
    width: "50%",
    margin: theme.spacing(1),
  },
  signInButtons: {
    display: "flex",
    flexDirection: "row",
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

export default function LoginForm() {
  const classes = useStyles();
  const user = useSelector((state: AppState) => state.auth.user);
  const dispatch = useDispatch();

  function onSignIn(googleUser: any) {
    console.log(googleUser);
    // const idToken = googleUser.tokenId;

    // dispatch(loginWithGoogle(idToken));
  }

  if (user.userId) {
    return <Redirect to="/" />;
  }

  return (
    <Paper className={classes.paper}>
      <Typography className={classes.text} variant="h3">
        Sign In
      </Typography>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        onSubmit={(
          values: IUserLoginData,
          { setSubmitting }: FormikHelpers<IUserLoginData>
        ) => {
          dispatch(loginUser(values));
          setSubmitting(false);
        }}
        validate={validate}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <Field
              className={classes.input}
              type="email"
              name="email"
              component={TextField}
              label="Email"
              variant="outlined"
            />
            <Field
              className={classes.input}
              type="password"
              name="password"
              component={TextField}
              label="Password"
              variant="outlined"
            />
            <div className={classes.signInButtons}>
              <Button
                className={classes.button}
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
              >
                Login
              </Button>
              {/* <div
                className={"g-signin2 " + classes.button}
                data-onsuccess={onSignIn}
              ></div> */}
              <GoogleLogin
                clientId={clientId}
                buttonText="Login"
                onSuccess={onSignIn}
                cookiePolicy={"single_host_origin"}
              />
            </div>
          </Form>
        )}
      </Formik>
      <Typography className={classes.text} variant="body2">
        Not our user yet? <Link to="/register">Register</Link>
      </Typography>
    </Paper>
  );
}
