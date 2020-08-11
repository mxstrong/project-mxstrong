import React, { useEffect } from "react";
import { makeStyles, Theme, Paper, Typography } from "@material-ui/core";
import { AppState } from "../reducers";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { fetchCurrentPost } from "../actions";

const useStyles = makeStyles((theme: Theme) => ({
  post: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingLeft: theme.spacing(60),
    paddingRight: theme.spacing(60),
  },
}));

interface IProps {
  postId: string | null;
}

export default function ViewPost(props: IProps) {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    if (props.postId) {
      dispatch(fetchCurrentPost(props.postId));
    }
  }, []);

  const post = useSelector((state: AppState) => state.posts.currentPost);

  if (!post) {
    return <Redirect to="/posts" />;
  }
  return (
    <Paper className={classes.post}>
      <Typography variant="h2">{post.title}</Typography>
      <Typography variant="subtitle1">{post.author}</Typography>
      <Typography variant="subtitle2">{post.topic}</Typography>
      <Typography variant="subtitle2">{post.createdAt}</Typography>
      <Typography variant="body2">{post.body}</Typography>
    </Paper>
  );
}
