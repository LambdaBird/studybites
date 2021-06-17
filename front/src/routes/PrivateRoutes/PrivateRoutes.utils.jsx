import * as paths from '@sb-ui/utils/paths';
import { Roles } from '@sb-ui/utils/constants';
import UserHome from '@sb-ui/pages/UserHome';
import AdminHome from '@sb-ui/pages/AdminHome';
import TeacherHome from '@sb-ui/pages/TeacherHome';
import UserLessons from '@sb-ui/pages/UserLessons';
import LessonEdit from '@sb-ui/pages/LessonEdit';
import LessonPage from '@sb-ui/pages/LessonPage';

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
  { component: LessonPage, path: paths.LESSON_PAGE },
  {
    component: UserLessons,
    path: paths.USER_LESSONS,
  },
  {
    component: UserHome,
    path: paths.USER_HOME,
  },
  {
    component: TeacherHome,
    path: paths.TEACHER_HOME,
    permissions: [Roles.TEACHER],
  },
  {
    component: LessonEdit,
    path: paths.LESSONS_EDIT_NEW,
    permissions: [Roles.TEACHER],
  },
  {
    component: LessonEdit,
    path: paths.LESSONS_EDIT,
    permissions: [Roles.TEACHER],
  },
];

export const getMainPage = (roles) => {
  if (roles.includes(Roles.SUPER_ADMIN)) {
    return <AdminHome />;
  }
  if (roles.includes(Roles.TEACHER)) {
    return <TeacherHome />;
  }
  return <UserHome />;
};
