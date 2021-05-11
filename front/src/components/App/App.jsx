import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Home from '../../pages/Home';

const App = () => (
  <Router>
    <Switch>
      <Route path="/asd">
        <Home />
      </Route>
    </Switch>
  </Router>
);

export default App;
