/* eslint-disable */
import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import { getJWT } from './utils/jwt/jwt';

const PrivateRoute = ({ children: Component, ...rest }) => {
  const isLoggedIn = !!getJWT()?.accessToken;
  if (isLoggedIn) {
    return <Route {...rest}>{Component}</Route>;
  }
  return <Redirect to={{ pathname: '/signIn' }} />;
};

const App = () => (
  <Router>
    <Switch>
      <Route path="/signIn">
        <SignIn />
      </Route>
      <Route path="/signUp">
        <SignUp />
      </Route>
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  </Router>
);

export default App;
