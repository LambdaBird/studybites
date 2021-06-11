import * as paths from '@sb-ui/utils/paths';
import UserHome from '@sb-ui/pages/UserHome';
import AdminHome from '@sb-ui/pages/AdminHome';
import UserLessons from '@sb-ui/pages/UserLessons';
import { Roles } from '@sb-ui/utils/constants';

export const checkPermission = (roles, permissions) => {
  if (!permissions) return true;

  return roles.find((role) =>
    permissions.some((permission) => role === permission),
  );
};

export const PRIVATE_ROUTES = [
  {
    component: AdminHome,
    path: paths.ADMIN_HOME,
    permissions: [Roles.SUPER_ADMIN],
  },
  {
    component: UserHome,
    path: paths.USER_HOME,
  },
  {
    component: UserLessons,
    path: paths.USER_LESSONS,
  },
  {
    component: () => <h1>Teacher</h1>,
    path: paths.TEACHER_HOME,
    permissions: [Roles.TEACHER],
  },
];

export const getMainPage = (roles) => {
  if (roles.includes(Roles.SUPER_ADMIN)) {
    return <AdminHome />;
  }
  if (roles.includes(Roles.TEACHER)) {
    return <h1>Teacher</h1>;
  }
  return <UserHome />;
};
