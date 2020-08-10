import React, { useEffect } from "react";
import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import { Route, Switch, Redirect } from "react-router-dom";
import Activate from "./Activate";
import Header from "./Header";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../reducers";
import { loadUser, loadUserProfile, logoutUser } from "../actions";
import Posts from "./Posts";
import AddPost from "./AddPost";
import EditPost from "./EditPost";
import InitialValues from "./InitialValues";

const App = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const userCookie = cookies["user"];
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);
  const userProfile = useSelector((state: AppState) => state.auth.userProfile);

  useEffect(() => {
    if (userCookie && !user) {
      dispatch(loadUser(userCookie));
      dispatch(loadUserProfile(userCookie));
    }
  });

  useEffect(() => {
    if (user && !userCookie) {
      setCookie("user", user, {
        path: "/",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      });
    }
  }, [user]);

  useEffect(() => {
    if (user && !userProfile) {
      dispatch(loadUserProfile(user));
    }
  });

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
        <Route path="/posts/add">
          <AddPost />
        </Route>
        <Route path="/posts/edit">
          <InitialValues />
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
