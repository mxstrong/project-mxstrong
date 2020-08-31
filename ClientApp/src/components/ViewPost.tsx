import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Button,
  TextField,
  CardActionArea,
} from "@material-ui/core";
import { AppState } from "../reducers";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { fetchCurrentPost, fetchComments } from "../actions";
import { IComment } from "../helpers/types";
import { role } from "../constants/roles";
import { ADD_COMMENT_URL } from "../constants/urls";

import Comment, { IState } from "./Comment";

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
      dispatch(fetchComments(props.postId));
    }
  }, []);
  const userToken = useSelector((state: AppState) => state.auth.user);
  const post = useSelector((state: AppState) => state.posts.currentPost);
  const comments = useSelector((state: AppState) => state.comments.comments);

  let [newComment, setNewComment] = useState<IState>({
    parentId: null,
    text: "",
    postId: post ? post.postId : "",
  });

  if (!post) {
    return <Redirect to="/posts" />;
  }

  async function handleClick() {
    const response = await fetch(ADD_COMMENT_URL, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + userToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newComment),
    });
    if (response.ok) {
      setNewComment({
        parentId: null,
        text: "",
        postId: post ? post.postId : "",
      });
      dispatch(fetchComments(post ? post.postId : ""));
    }
  }

  return (
    <Paper className={classes.post}>
      <Typography variant="h2">{post.title}</Typography>
      <Typography variant="subtitle1">{post.author}</Typography>
      <Typography variant="subtitle2">{post.topic}</Typography>
      <Typography variant="subtitle2">{post.createdAt}</Typography>
      <Typography variant="body2">{post.body}</Typography>
      {newComment.parentId == null ? (
        <React.Fragment>
          <TextField
            variant="outlined"
            multiline
            placeholder="Write comment's text here"
            value={newComment.text}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setNewComment({ ...newComment, text: event.target.value })
            }
          />
          <Button color="primary" onClick={handleClick}>
            Comment
          </Button>{" "}
        </React.Fragment>
      ) : (
        ""
      )}

      <React.Fragment>
        {comments && comments.length > 0
          ? comments.map((comment: IComment) => (
              <Comment comment={comment} parentId={null} />
            ))
          : "No comments yet..."}
      </React.Fragment>
    </Paper>
  );
}
