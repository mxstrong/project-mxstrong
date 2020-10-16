import React, { useEffect, useState } from "react";
import { Typography, makeStyles, Theme, Paper, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../../actions/posts";
import { AppState } from "../../reducers";
import { IPost } from "../../helpers/types";
import { useHistory } from "react-router-dom";
import AuthenticationDialog from "../AuthenticationDialog";
import Post from "./Post";

const useStyles = makeStyles((theme: Theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

export default function Posts() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const user = useSelector((state: AppState) => state.auth.user);

  let history = useHistory();

  const [open, setOpen] = useState(false);

  function handleClick() {
    if (user.userId) {
      history.push("/posts/add");
    } else {
      setOpen(true);
    }
  }

  function handleClose() {
    setOpen(false);
  }

  const posts = useSelector((state: AppState) => state.posts.posts);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Posts</Typography>
      <Fab color="primary" variant="extended" onClick={() => handleClick()}>
        Add New Post
        <AddIcon />
      </Fab>
      <AuthenticationDialog open={open} handleClose={handleClose} />
      {posts.map((post: IPost) => (
        <Post post={post} />
      ))}
    </Paper>
  );
}
