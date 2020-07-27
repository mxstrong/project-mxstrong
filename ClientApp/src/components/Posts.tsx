import React, { useEffect } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../actions";
import { AppState } from "../reducers";
import { IPost } from "../helpers/types";
import { Link } from "react-router-dom";

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
    dispatch(fetchPosts);
  });

  const posts = useSelector((state: AppState) => state.posts);

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Posts</Typography>
      {posts.map((post: IPost) => (
        <Card>
          <CardContent>
            <Typography variant="h5">post.title</Typography>
            <Typography variant="subtitle1">post.topic</Typography>
            <Typography variant="body1">post.body</Typography>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardActionArea>
          <Link to="/posts/add" component={IconButton}>
            <AddIcon />
          </Link>
        </CardActionArea>
      </Card>
    </Paper>
  );
}
