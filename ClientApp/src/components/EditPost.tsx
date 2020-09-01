import React, { useEffect, useState } from "react";
import { Paper, MenuItem, Button, makeStyles, Theme } from "@material-ui/core";
import { editPost, fetchTopics } from "../actions";
import {
  ITopic,
  IEditPostData,
  IPostFormData,
  IIndexable,
} from "../helpers/types";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { AppState } from "../reducers";
import { useCookies } from "react-cookie";
import { Field, Form, Formik, FormikHelpers, useFormikContext } from "formik";
import { TextField } from "formik-material-ui";
import PostForm from "./PostForm";

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

export default function EditPost() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);
  const [cookies] = useCookies(["user"]);
  const userCookie = cookies["user"];
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchTopics());
  }, []);

  const userToken = useSelector((state: AppState) => state.auth.user);
  const post = useSelector((state: AppState) => state.posts.currentPost);

  if ((!user && !userCookie) || !post) {
    return <Redirect to="/posts" />;
  }

  if (success) {
    return <Redirect to="/posts" />;
  }

  return (
    <Paper className={classes.paper}>
      <Formik
        initialValues={{
          title: post.title,
          topic: post.topic,
          otherTopic: "",
          body: post.body,
        }}
        onSubmit={(
          values: IPostFormData,
          { setSubmitting }: FormikHelpers<IPostFormData>
        ) => {
          const postData: IEditPostData = {
            postId: post ? post.postId : "",
            title: values.title,
            topic: values.topic,
            otherTopic: values.otherTopic,
            body: values.body,
            userId: post ? post.userId : "",
            author: post ? post.author : "",
            createdAt: post ? post.createdAt : "",
          };
          dispatch(editPost(postData));
          setSubmitting(false);
          setSuccess(true);
        }}
        validate={validate}
      >
        {({ isSubmitting }) => <PostForm isSubmitting={isSubmitting} />}
      </Formik>
    </Paper>
  );
}
