import { matchPath } from 'react-router-dom';

import { AdminHome } from '@sb-ui/pages/Admin';
import { LessonEdit,TeacherHome } from '@sb-ui/pages/Teacher';
import {
  EnrollModalDesktop,
  EnrollModalMobile,
  LessonPage,
  UserHome,
  UserLessons,
} from '@sb-ui/pages/User';
import { Roles } from '@sb-ui/utils/constants';
import * as paths from '@sb-ui/utils/paths';
import { LESSONS_EDIT, LESSONS_NEW } from '@sb-ui/utils/paths';

const SKIP_HEADER = [LESSONS_NEW, LESSONS_EDIT];

export const checkPermission = (roles, permissions) => {
  if (!permissions) return true;

  return roles?.find((role) =>
    permissions.some((permission) => role === permission),
  );
};

export const getPrivateRoutes = ({ isMobile }) => [
  {
    component: AdminHome,
    path: paths.ADMIN_HOME,
    permissions: [Roles.SUPER_ADMIN],
    exact: true,
  },
  { component: LessonPage, path: paths.LESSON_PAGE, exact: true },
  {
    component: UserLessons,
    path: paths.USER_LESSONS,
    exact: true,
  },
  {
    component: UserHome,
    path: paths.USER_HOME,
    exact: true,
    children: !isMobile
      ? [
          {
            component: EnrollModalDesktop,
            path: paths.USER_ENROLL,
            exact: true,
          },
        ]
      : null,
  },
  {
    component: TeacherHome,
    path: paths.TEACHER_HOME,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  {
    component: LessonEdit,
    path: paths.LESSONS_NEW,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  {
    component: LessonEdit,
    path: paths.LESSONS_EDIT,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  ...(isMobile
    ? [
        {
          component: EnrollModalMobile,
          path: paths.USER_ENROLL,
          exact: true,
        },
      ]
    : []),
];

export const getPagesWithSkippedHeader = (pathname) =>
  SKIP_HEADER.map((header) =>
    matchPath(pathname, {
      path: header,
      exact: true,
    }),
  ).some((x) => !!x);

export const getMainPage = (roles) => {
  if (roles?.includes(Roles.SUPER_ADMIN)) {
    return <AdminHome />;
  }
  if (roles?.includes(Roles.TEACHER)) {
    return <TeacherHome />;
  }
  return <UserHome />;
};
