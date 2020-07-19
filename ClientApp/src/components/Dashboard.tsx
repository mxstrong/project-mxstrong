import React, { useEffect } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  Button,
  IconButton,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopics, fetchPosts } from "../actions";
import { AppState } from "../reducers";
import { IPost } from "../helpers/types";

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
}));

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTopics);
    dispatch(fetchPosts);
  });

  // const topics = useSelector((state: AppState) => state.topics);
  const posts = useSelector((state: AppState) => state.posts.posts);

  return (
    <Paper className={classes.root}>
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
          <IconButton>
            <AddIcon />
          </IconButton>
        </CardActionArea>
      </Card>
    </Paper>
  );
}
