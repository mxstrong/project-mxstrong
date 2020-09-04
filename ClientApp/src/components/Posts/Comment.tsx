import { IComment } from "../../helpers/types";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../reducers";
import React, { useState } from "react";
import {
  EDIT_COMMENT_URL,
  DELETE_COMMENT_URL,
  ADD_COMMENT_URL,
} from "../../constants/urls";
import { fetchComments } from "../../actions/posts";
import {
  Card,
  TextField,
  Button,
  CardHeader,
  CardContent,
  CardActionArea,
  makeStyles,
  Theme,
} from "@material-ui/core";
import { role } from "../../constants/roles";

interface ICommentProps {
  comment: IComment;
  parentId: string | null;
}

export interface IState {
  parentId: string | null;
  text: string;
  postId: string;
}

const useStyles = makeStyles((theme: Theme) => ({
  comment: {
    margin: theme.spacing(2),
    width: "300px",
  },
  commentWrapper: {
    marginLeft: theme.spacing(2),
  },
  header: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
}));

export default function Comment(props: ICommentProps) {
  const { comment, parentId } = props;
  const classes = useStyles();
  const dispatch = useDispatch();

  const user = useSelector((state: AppState) => state.auth.user);
  const post = useSelector((state: AppState) => state.posts.currentPost);

  let [commentToEdit, setCommentToEdit] = useState({
    commentId: "",
    text: "",
    postId: post ? post.postId : "",
    userId: user.userId,
  });

  let [newComment, setNewComment] = useState<IState>({
    parentId: null,
    text: "",
    postId: post ? post.postId : "",
  });

  if (comment.parentId !== null && comment.parentId !== parentId) {
    return <React.Fragment></React.Fragment>;
  }

  async function handleEdit() {
    const response = await fetch(
      EDIT_COMMENT_URL + "/" + commentToEdit.commentId,
      {
        method: "PUT",
        headers: {
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
        userId: user.userId,
      });
      dispatch(fetchComments(post ? post.postId : ""));
    }
  }

  async function handleDelete(commentId: string) {
    const response = await fetch(DELETE_COMMENT_URL + "/" + commentId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      dispatch(fetchComments(post ? post.postId : ""));
    }
  }

  async function handleClick() {
    const response = await fetch(ADD_COMMENT_URL, {
      method: "POST",
      headers: {
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
    <div className={classes.commentWrapper}>
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
              variant="outlined"
            />
            <Button color="primary" onClick={handleEdit}>
              Update Comment
            </Button>
            <Button
              color="secondary"
              onClick={() =>
                setCommentToEdit({
                  commentId: "",
                  text: "",
                  postId: post ? post.postId : "",
                  userId: user.userId,
                })
              }
            >
              Cancel
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <CardHeader
              className={classes.header}
              action={
                user.role === role.admin || user.userId === comment.userId ? (
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
                onClick={() => {
                  if (newComment.parentId !== comment.commentId) {
                    setNewComment({
                      ...newComment,
                      parentId: comment.commentId,
                    });
                  } else {
                    setNewComment({
                      ...newComment,
                      parentId: null,
                    });
                  }
                }}
              >
                Reply
              </Button>
            </CardActionArea>
            {newComment.parentId == comment.commentId ? (
              <React.Fragment>
                <TextField
                  variant="outlined"
                  multiline
                  placeholder="Write comment's text here"
                  value={newComment.text}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    setNewComment({
                      ...newComment,
                      text: event.target.value,
                    })
                  }
                />
                <Button color="primary" onClick={handleClick}>
                  Comment
                </Button>
              </React.Fragment>
            ) : (
              ""
            )}
          </React.Fragment>
        )}
      </Card>
      {comment.children
        ? comment.children.map((child) => (
            <Comment comment={child} parentId={comment.commentId} />
          ))
        : ""}
    </div>
  );
}
