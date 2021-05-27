import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import UserHome from './pages/UserHome/UserHome';
import './App.css';

const App = () => (
  <Router>
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
