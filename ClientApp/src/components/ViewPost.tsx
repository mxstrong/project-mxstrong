import React, { useEffect, useState } from "react";
import {
  makeStyles,
  Theme,
  Paper,
  Typography,
  Card,
  CardContent,
  CardHeader,
  IconButton,
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
import { render } from "@testing-library/react";
import {
  ADD_COMMENT_URL,
  EDIT_COMMENT_URL,
  DELETE_COMMENT_URL,
} from "../constants/urls";

const useStyles = makeStyles((theme: Theme) => ({
  comment: {
    margin: theme.spacing(1),
  },
  header: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
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

interface IState {
  parentId: string | null;
  text: string;
  postId: string;
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
  const userProfile = useSelector((state: AppState) => state.auth.userProfile);
  const post = useSelector((state: AppState) => state.posts.currentPost);
  const comments = useSelector((state: AppState) => state.comments.comments);

  let [newComment, setNewComment] = useState<IState>({
    parentId: null,
    text: "",
    postId: post ? post.postId : "",
  });

  let [commentToEdit, setCommentToEdit] = useState({
    commentId: "",
    text: "",
    postId: post ? post.postId : "",
    userId: userProfile.userId,
  });

  if (!post) {
    return <Redirect to="/posts" />;
  }

  function renderComment(comment: IComment) {
    return (
      <Card key={comment.commentId} className={classes.comment}>
        {comment.commentId == commentToEdit.commentId ? (
          <React.Fragment>
            <TextField
              multiline
              placeholder="Write updated comment's text here"
              value={commentToEdit.text}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setCommentToEdit({
                  ...commentToEdit,
                  text: event.target.value,
                })
              }
            />
            <Button color="primary" onClick={handleEdit}>
              Update Comment
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CardHeader
              className={classes.header}
              action={
                userProfile.role === role.admin ||
                userProfile.userId == (post ? post.userId : "") ? (
                  <React.Fragment>
                    <Button
                      onClick={() =>
                        setCommentToEdit({
                          ...commentToEdit,
                          commentId: comment.commentId,
                          text: comment.text,
                        })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      color="secondary"
                      onClick={() => handleDelete(comment.commentId)}
                    >
                      Delete
                    </Button>
                  </React.Fragment>
                ) : (
                  ""
                )
              }
              title={comment.author}
            />
            <CardContent>{comment.text}</CardContent>
            <CardActionArea>
              <Button
                color="primary"
                onClick={() =>
                  setNewComment({
                    ...newComment,
                    parentId: comment.commentId,
                  })
                }
              >
                Reply
              </Button>
            </CardActionArea>
          </React.Fragment>
        )}
      </Card>
    );
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

  async function handleEdit() {
    const response = await fetch(
      EDIT_COMMENT_URL + "/" + commentToEdit.commentId,
      {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + userToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentToEdit),
      }
    );
    if (response.ok) {
      setCommentToEdit({
        commentId: "",
        text: "",
        postId: post ? post.postId : "",
        userId: userProfile.userId,
      });
      dispatch(fetchComments(post ? post.postId : ""));
    }
  }

  async function handleDelete(commentId: string) {
    const response = await fetch(DELETE_COMMENT_URL + "/" + commentId, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + userToken,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
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
      </Button>
      <React.Fragment>
        {comments && comments.length > 0
          ? comments.map((comment: IComment) => renderComment(comment))
          : "No comments yet..."}
      </React.Fragment>
    </Paper>
  );
}
