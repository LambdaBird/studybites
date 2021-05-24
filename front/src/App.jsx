import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/moleculas/Header';
import AuthRoute from './components/AuthRoute/AuthRoute';

const App = () => (
  <Router>
    <Header />
    <Switch>
      <AuthRoute path="/signIn">
        <SignIn />
      </AuthRoute>
      <AuthRoute path="/signUp">
        <SignUp />
      </AuthRoute>
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  </Router>
);

export default App;
