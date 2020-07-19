import React, { useEffect } from "react";
import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import { Route, Switch } from "react-router-dom";
import Activate from "./Activate";
import Header from "./Header";
import Dashboard from "./Dashboard";
import { useCookies } from "react-cookie";
import { useSelector, useDispatch } from "react-redux";
import { AppState } from "../reducers";
import { loadUser, loadUserProfile, logoutUser } from "../actions";

const App = () => {
  const [cookies, setCookie] = useCookies(["user"]);
  const userCookie = cookies["user"];
  const dispatch = useDispatch();
  const user = useSelector((state: AppState) => state.auth.user);

  useEffect(() => {
    if (userCookie && !user) {
      dispatch(loadUser(userCookie));
      dispatch(loadUserProfile(userCookie));
    }
  });

  useEffect(() => {
    if (user && !userCookie) {
      setCookie("user", user, { path: "/" });
    }
  }, [user]);

  return (
    <React.Fragment>
      <Header />
      <Switch>
        <Route path="/" exact>
          <Dashboard />
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
