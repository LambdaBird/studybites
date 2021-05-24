import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/atoms/PrivateRoute/PrivateRoute';
import Header from './components/atoms/Header';
import logoImg from './resources/img/logo.svg';

const App = () => (
  <Router>
    <Header logoImg={logoImg} logoTitle="StudyBites" />
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
