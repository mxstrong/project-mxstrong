import React, { useEffect } from "react";
import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import { Route, Switch, Redirect, useLocation } from "react-router-dom";
import Activate from "./Activate";
import Header from "./Header";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../reducers";
import Posts from "./Posts";
import AddPost from "./AddPost";
import ViewPost from "./ViewPost";
import EditPost from "./EditPost";
import { fetchCurrentUser } from "../actions";

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
      </Switch>
    </React.Fragment>
  );
};

export default App;
