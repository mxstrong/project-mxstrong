import React from "react";
import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import { Route, Switch, Redirect } from "react-router-dom";
import Activate from "./Activate";

const App = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/login" />
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
  );
};

export default App;
