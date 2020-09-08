import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  Paper,
  Typography,
  Button,
  TextField,
} from "@material-ui/core";
import { AppState } from "../../reducers";
import { useSelector, useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";
import { fetchCurrentPost, fetchComments } from "../../actions/posts";
import { IComment } from "../../helpers/types";
import { COMMENTS_URL } from "../../constants/urls";

import Comment, { IState } from "./Comment";
import AuthenticationDialog from "../AuthenticationDialog";

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
  const user = useSelector((state: AppState) => state.auth.user);
  const post = useSelector((state: AppState) => state.posts.currentPost);
  const comments = useSelector((state: AppState) => state.comments.comments);

  const [newComment, setNewComment] = useState<IState>({
    parentId: null,
    text: "",
    postId: post ? post.postId : "",
  });

  const [open, setOpen] = useState(false);

  if (!post) {
    return <Redirect to="/posts" />;
  }

  async function handleClick() {
    if (!user.userId) {
      setOpen(true);
    } else {
      const response = await fetch(COMMENTS_URL, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + user,
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
  }

  function handleClose() {
    setOpen(false);
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
          {user.userId ? (
            <TextField
              variant="outlined"
              multiline
              placeholder="Write comment's text here"
              value={newComment.text}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setNewComment({ ...newComment, text: event.target.value })
              }
            />
          ) : (
            ""
          )}
          <Button color="primary" onClick={handleClick}>
            Comment
          </Button>
          <AuthenticationDialog open={open} handleClose={handleClose} />
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
