import { matchPath } from 'react-router-dom';

import { AdminHome } from '@sb-ui/pages/Admin';
import Profile from '@sb-ui/pages/Profile';
import {
  LessonEdit,
  LessonPreview,
  LessonStudents,
  TeacherHome,
  TeacherStudents,
} from '@sb-ui/pages/Teacher';
import CourseEdit from '@sb-ui/pages/Teacher/CourseEdit';
import {
  CoursePage,
  EnrollCourseModalDesktop,
  EnrollCourseModalMobile,
  EnrollLessonModalDesktop,
  EnrollLessonModalMobile,
  LearnPage,
  UserCourses,
  UserHome,
  UserLessons,
} from '@sb-ui/pages/User';
import { Roles } from '@sb-ui/utils/constants';
import * as paths from '@sb-ui/utils/paths';
import {
  COURSES_EDIT,
  LEARN_PAGE,
  LESSONS_EDIT,
  LESSONS_PREVIEW,
} from '@sb-ui/utils/paths';

const SKIP_HEADER = [LESSONS_EDIT, LEARN_PAGE, LESSONS_PREVIEW, COURSES_EDIT];

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
  {
    component: Profile,
    path: paths.PROFILE,
    exact: true,
  },
  { component: LearnPage, path: paths.LEARN_PAGE, exact: true },
  { component: LessonPreview, path: paths.LESSONS_PREVIEW, exact: true },
  { component: CoursePage, path: paths.LEARN_COURSE_PAGE, exact: true },
  {
    component: UserLessons,
    path: paths.USER_LESSONS,
    exact: true,
  },
  {
    component: UserCourses,
    path: paths.USER_COURSES,
    exact: true,
  },
  {
    component: UserHome,
    path: paths.USER_HOME,
    exact: true,
    children: !isMobile
      ? [
          {
            component: EnrollLessonModalDesktop,
            path: paths.USER_ENROLL_LESSON,
            exact: true,
          },
          {
            component: EnrollCourseModalDesktop,
            path: paths.USER_ENROLL_COURSE,
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
    component: TeacherStudents,
    path: paths.TEACHER_STUDENTS,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  {
    component: LessonStudents,
    path: paths.TEACHER_LESSONS_STUDENTS,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  {
    component: LessonEdit,
    path: paths.LESSONS_EDIT,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  {
    component: CourseEdit,
    path: paths.COURSES_EDIT,
    permissions: [Roles.TEACHER],
    exact: true,
  },
  ...(isMobile
    ? [
        {
          component: EnrollLessonModalMobile,
          path: paths.USER_ENROLL_LESSON,
          exact: true,
        },
        {
          component: EnrollCourseModalMobile,
          path: paths.USER_ENROLL_COURSE,
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
