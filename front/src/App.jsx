import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/moleculas/Header';
import AuthRoute from './components/AuthRoute/AuthRoute';
import UserHome from './pages/UserHome/UserHome';
import { GlobalBody } from './resources/styles/Global.styled';
import UserLessons from './pages/UserLessons';

const App = () => (
  <Router>
    <GlobalBody />
    <Header />
    <Switch>
      <AuthRoute path="/signIn">
        <SignIn />
      </AuthRoute>
      <AuthRoute path="/signUp">
        <SignUp />
      </AuthRoute>
      <PrivateRoute path="/user-home">
        <UserHome />
      </PrivateRoute>
      <PrivateRoute path="/user-lessons">
        <UserLessons />
      </PrivateRoute>
      <PrivateRoute path="/">
        <Home />
      </PrivateRoute>
    </Switch>
  </Router>
);

export default App;
