import React, { useEffect } from "react";
import Auth from "./Auth/Auth";
import Login from "./Auth/Login";
import Register from "./Auth/Register";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import Activate from "./Auth/Activate";
import Header from "./Header";
import { useDispatch } from "react-redux";
import Posts from "./Posts/Posts";
import AddPost from "./Posts/AddPost";
import ViewPost from "./Posts/ViewPost";
import EditPost from "./Posts/EditPost";
import { fetchCurrentUser } from "../actions/auth";
import Goals from "./Goals/Goals";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, []);

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  let query = useQuery();

  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Redirect to="/posts" />
        </Route>
        <Route path="/posts" exact>
          <Posts />
        </Route>
        <Route path="/post">
          <ViewPost postId={query.get("id")} />
        </Route>
        <Route path="/posts/add">
          <AddPost />
        </Route>
        <Route path="/posts/edit">
          <EditPost />
        </Route>
        <Route path="/login">
          <Auth>
            <Login />
          </Auth>
        </Route>
        <Route path="/register">
          <Auth>
            <Register />
          </Auth>
        </Route>
        <Route path="/activate">
          <Auth>
            <Activate />
          </Auth>
        </Route>
        <Route path="/goals">
          <Goals />
        </Route>
      </Switch>
    </React.Fragment>
  );
};

export default App;
