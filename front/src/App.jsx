import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import UserHome from './pages/UserHome/UserHome';
import { GlobalBody } from './resources/styles/Global.styled';

const App = () => (
  <Router>
    <GlobalBody />
    <Switch>
      <Route path="/user-home">
        <UserHome />
      </Route>
      <Route path="/signUp">
        <SignUp />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default App;
