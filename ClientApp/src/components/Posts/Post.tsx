import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  IconButton,
  makeStyles,
  Menu,
  MenuItem,
  Theme,
  Typography,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { fetchCurrentPost, fetchPosts } from "../../actions/posts";
import { POSTS_URL } from "../../constants/urls";
import { IPost } from "../../helpers/types";
import { AppState } from "../../reducers";
import { role } from "../../constants/roles";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    width: "240px",
    margin: theme.spacing(1),
  },
  menu: {
    boxShadow: "none",
  },
  link: {
    textDecoration: "none",
    color: "#000000",
  },
}));

interface IPostProps {
  post: IPost;
}

export default function Post(props: IPostProps) {
  const classes = useStyles();
  const { post } = props;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const dispatch = useDispatch();

  const user = useSelector((state: AppState) => state.auth.user);

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  async function handleDelete(post: IPost) {
    const response = await fetch(POSTS_URL + "/" + post.postId, {
      method: "DELETE",
    });
    if (response.ok) {
      dispatch(fetchPosts());
    }
    handleClose();
  }

  const history = useHistory();

  async function handleEdit(post: IPost) {
    async function loadPost() {
      return dispatch(fetchCurrentPost(post.postId));
    }
    await loadPost();
    history.push("/posts/edit");
    handleClose();
  }

  return (
    <Card className={classes.card} key={post.postId}>
      <CardHeader
        action={
          user.role === role.admin || user.userId == post.userId ? (
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
                <MenuItem onClick={() => handleEdit(post)}>Edit</MenuItem>
                <MenuItem onClick={() => handleDelete(post)}>Delete</MenuItem>
              </Menu>
            </React.Fragment>
          ) : (
            ""
          )
        }
        title={post.title}
        subheader={`By ${post.author} 
              Topic: ${post.topic}  
              ${post.createdAt}`}
      />
      <Link to={"/post?id=" + post.postId} className={classes.link}>
        <CardContent>
          <Typography variant="body2">{post.body}...</Typography>
        </CardContent>
      </Link>
    </Card>
  );
}
