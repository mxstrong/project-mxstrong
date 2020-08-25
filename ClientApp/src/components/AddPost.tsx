import React, { useEffect, useState } from "react";
import { Paper, makeStyles, Theme, Button, MenuItem } from "@material-ui/core";
import { fetchTopics, addNewPost } from "../actions";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../reducers";
import { ITopic, IPostFormData, IIndexable } from "../helpers/types";
import { Link, Redirect } from "react-router-dom";
import { useCookies } from "react-cookie";
import { Field, Formik, Form, FormikHelpers } from "formik";
import { TextField } from "formik-material-ui";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
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
  button: {
    margin: theme.spacing(1),
  },
}));

const validate = (values: IPostFormData) => {
  const errors: IErrors = {};
  const requiredFields: string[] = ["title", "body", "topic"];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = "Required";
    }
  });

  if (values.topic === "other" && !values["otherTopic"]) {
    errors["otherTopic"] = "You must specify other topic";
  }

  return errors;
};

type IErrors = IIndexable & {
  title?: string;
  topic?: string;
  otherTopic?: string;
  body?: string;
};

export default function AddPost() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);
  const [cookies] = useCookies(["user"]);
  const userCookie = cookies["user"];
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchTopics());
  }, []);

  const topics = useSelector((state: AppState) => state.topics);
  const topic = useSelector(
    (state: AppState) => state.form.AddPostForm?.values?.topic
  );

  if (!user && !userCookie) {
    return <Redirect to="/posts" />;
  }

  if (success) {
    return <Redirect to="/posts" />;
  }

  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={{
          title: "",
          topic: "",
          otherTopic: "",
          body: "",
        }}
        onSubmit={(
          values: IPostFormData,
          { setSubmitting }: FormikHelpers<IPostFormData>
        ) => {
          dispatch(addNewPost(values, user));
          setSubmitting(false);
          setSuccess(true);
        }}
        validate={validate}
      >
        {({ isSubmitting }) => (
          <Form className={classes.form}>
            <Field
              className={classes.input}
              name="title"
              component={TextField}
              label="Title"
              variant="outlined"
            />
            <Field
              select
              className={classes.input}
              name="topic"
              component={TextField}
              label="Topic"
              variant="outlined"
            >
              <MenuItem value="">None</MenuItem>
              {topics.map((topic: ITopic) => (
                <MenuItem value={topic.name}>{topic.name}</MenuItem>
              ))}
              <MenuItem value="other">Other</MenuItem>
            </Field>
            {topic === "other" ? (
              <Field
                className={classes.input}
                name="otherTopic"
                component={TextField}
                label="Other Topic"
                variant="outlined"
              />
            ) : (
              ""
            )}
            <Field
              className={classes.input}
              name="body"
              component={TextField}
              label="Body"
              multiline
              variant="outlined"
            />
            <div>
              <Button
                className={classes.button}
                type="submit"
                disabled={isSubmitting}
                variant="contained"
                color="primary"
              >
                Submit
              </Button>
              <Button
                to="/posts"
                className={classes.button}
                component={Link}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Paper>
  );
}
