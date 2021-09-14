import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import * as paths from '../utils/paths';

import AuthRoute from './AuthRoute';
import Demo from './Demo';
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
      {process.env.REACT_APP_DEMO_MODE && (
        <Route path={paths.DEMO_LESSON}>
          <Demo />
        </Route>
      )}
      <PrivateRoutes />
    </Switch>
  </Router>
);

export default Routes;
