import React from "react";
import { useFormikContext, Form, Field } from "formik";
import { IPostFormData, ITopic } from "../helpers/types";
import { MenuItem, Button, makeStyles, Theme } from "@material-ui/core";
import { Link } from "react-router-dom";
import { TextField } from "formik-material-ui";
import { useSelector } from "react-redux";
import { AppState } from "../reducers";

const useStyles = makeStyles((theme: Theme) => ({
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

interface IPostFormProps {
  isSubmitting: boolean;
}

export default function PostForm(props: IPostFormProps) {
  const { isSubmitting } = props;
  const classes = useStyles();
  const { values } = useFormikContext<IPostFormData>();

  const topics = useSelector((state: AppState) => state.topics);

  return (
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
      {values.topic === "other" ? (
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
  );
}
