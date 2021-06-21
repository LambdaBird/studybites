import { Switch, Redirect, Route, useLocation } from 'react-router-dom';
import { useQuery } from 'react-query';
import * as paths from '@sb-ui/utils/paths';
import { getJWTAccessToken } from '@sb-ui/utils/jwt';
import Header from '@sb-ui/components/molecules/Header';
import { getUser } from '@sb-ui/utils/api/v1/user';
import { USER_BASE_QUERY } from '@sb-ui/utils/queries';
import {
  PRIVATE_ROUTES,
  checkPermission,
  getMainPage,
  getPagesWithSkippedHeader,
} from './PrivateRoutes.utils';

const PrivateRoutes = () => {
  const location = useLocation();

  const isLoggedIn = getJWTAccessToken();
  const { data: userResponse, isLoading: isUserLoading } = useQuery(
    USER_BASE_QUERY,
    getUser,
  );
  const user = userResponse?.data;

  if (!isLoggedIn) {
    return <Redirect to={paths.SIGN_IN} />;
  }

  if (isUserLoading) {
    return null;
  }

  const allowedRoutes = PRIVATE_ROUTES.filter((route) =>
    checkPermission(user.roles, route.permissions),
  );

  return (
    <>
      {getPagesWithSkippedHeader(location.pathname) || <Header />}
      <Switch>
        <Route path={paths.HOME} exact>
          {getMainPage(user.roles)}
        </Route>
        {allowedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            render={(props) => <route.component {...props} />}
          />
        ))}
        <Route path="*">
          <h1>Not Found</h1>
        </Route>
      </Switch>
    </>
  );
};

export default PrivateRoutes;
