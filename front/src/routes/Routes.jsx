import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import ChangePassword from '../pages/ChangePassword';
import ForgetPassword from '../pages/ForgetPassword';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import * as paths from '../utils/paths';

import AuthRoute from './AuthRoute';
import PrivateRoutes from './PrivateRoutes';

const Routes = () => (
  <Router>
    <Switch>
      <Route path={paths.CHANGE_PASSWORD}>
        <ChangePassword />
      </Route>
      <AuthRoute path={paths.FORGET_PASSWORD}>
        <ForgetPassword />
      </AuthRoute>
      <AuthRoute path={paths.SIGN_IN}>
        <SignIn />
      </AuthRoute>
      <AuthRoute path={paths.SIGN_UP}>
        <SignUp />
      </AuthRoute>
      <PrivateRoutes />
    </Switch>
  </Router>
);

export default Routes;
