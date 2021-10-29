import { BrowserRouter as Router, Switch } from 'react-router-dom';

import ChangePassword from '../pages/ChangePassword';
import EmailSent from '../pages/EmailSent';
import ForgotPassword from '../pages/ForgotPassword';
import Invite from '../pages/Invite';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import VerifyEmail from '../pages/VerifyEmail';
import * as paths from '../utils/paths';

import AuthRoute from './AuthRoute';
import PrivateRoutes from './PrivateRoutes';

const Routes = () => (
  <Router>
    <Switch>
      <AuthRoute isPublic path={paths.VERIFY_EMAIL}>
        <VerifyEmail />
      </AuthRoute>
      <AuthRoute path={paths.FORGOT_PASSWORD}>
        <ForgotPassword />
      </AuthRoute>
      <AuthRoute isPublic path={paths.EMAIL_SENT}>
        <EmailSent />
      </AuthRoute>
      <AuthRoute isPublic path={paths.CHANGE_PASSWORD}>
        <ChangePassword />
      </AuthRoute>
      <AuthRoute isPublic path={paths.INVITE}>
        <Invite />
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
