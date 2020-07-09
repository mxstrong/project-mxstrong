import React from "react";
import Auth from "./Auth";
import Login from "./Login";
import Register from "./Register";
import { Route, Switch, Redirect } from "react-router-dom";
import Activate from "./Activate";
import Header from "./Header";
import Dashboard from "./Dashboard";

const App = () => {
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
