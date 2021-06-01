import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import TeacherHome from './pages/TeacherHome';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';

const App = () => (
  <Router>
    <Switch>
      <Route path="/signIn">
        <SignIn />
      </Route>
      <Route path="/signUp">
        <SignUp />
      </Route>
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/teacher/:id/home">
        <TeacherHome />
      </Route>
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  </Router>
);

export default App;
