import { BrowserRouter as Router, Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import * as paths from '../utils/paths';

import AuthRoute from './AuthRoute';
import PrivateRoutes from './PrivateRoutes';

const Routes = () => (
  <Router>
    <Switch>
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
