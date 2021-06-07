import React from 'react';
import { BrowserRouter as Router, Switch } from 'react-router-dom';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import UserLessons from './pages/UserLessons';
import AdminHome from './pages/AdminHome';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/molecules/Header';
import AuthRoute from './components/AuthRoute';
import UserHome from './pages/UserHome';
import * as paths from './utils/paths';
import { GlobalBody } from './resources/styles/Global.styled';

const App = () => (
  <Router>
    <GlobalBody />
    <Header />
    <GlobalBody />
    <Switch>
      <AuthRoute path={paths.SIGN_IN}>
        <SignIn />
      </AuthRoute>
      <AuthRoute path={paths.SIGN_UP}>
        <SignUp />
      </AuthRoute>
      <PrivateRoute path={paths.ADMIN_HOME}>
        <AdminHome />
      </PrivateRoute>
      <PrivateRoute path={paths.USER_HOME}>
        <UserHome />
      </PrivateRoute>
      <PrivateRoute path={paths.USER_LESSONS}>
        <UserLessons />
      </PrivateRoute>
      <PrivateRoute exact path={paths.HOME}>
        <Home />
      </PrivateRoute>
    </Switch>
  </Router>
);

export default App;
