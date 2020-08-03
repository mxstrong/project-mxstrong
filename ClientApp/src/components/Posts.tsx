import React, { useEffect, useState } from "react";
import {
  Typography,
  makeStyles,
  Theme,
  Paper,
  Card,
  CardContent,
  CardActionArea,
  IconButton,
  CardHeader,
  Fab,
  Popover,
  Menu,
  MenuItem,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
  card: {
    width: "240px",
    margin: theme.spacing(1),
  },
  menu: {
    boxShadow: "none",
  },
}));

export default function Posts() {
  const classes = useStyles();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  const posts = useSelector((state: AppState) => state.posts);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Paper className={classes.paper}>
      <Typography variant="h3">Posts</Typography>
      {posts.map((post: IPost) => (
        <Card className={classes.card}>
          <CardHeader
            action={
              <React.Fragment>
                <IconButton aria-label="settings" onClick={handleClick}>
                  <MoreVertIcon />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  keepMounted
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  className={classes.menu}
                >
                  <MenuItem onClick={handleClose}>Edit</MenuItem>
                  <MenuItem onClick={handleClose}>Delete</MenuItem>
                </Menu>
              </React.Fragment>
            }
            title={post.title}
            subheader={post.topic}
          />
          <CardContent>
            <Typography variant="body2">{post.body}</Typography>
          </CardContent>
        </Card>
      ))}
      <Card>
        <CardActionArea>
          <Link to="/posts/add" component={Fab} color="primary">
            <AddIcon />
          </Link>
        </CardActionArea>
      </Card>
    </Paper>
  );
}
