import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import TeacherHome from './pages/TeacherHome';

const App = () => (
  <Router>
    <Switch>
      <Route path="/signUp">
        <SignUp />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/teacher/:id/home">
        <TeacherHome />
      </Route>
    </Switch>
  </Router>
);

export default App;
