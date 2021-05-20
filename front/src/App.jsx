import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/SignIn';

const App = () => (
  <Router>
    <Switch>
      <Route path="/signIn">
        <SignIn />
      </Route>
      <Route path="/">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default App;
