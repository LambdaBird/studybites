export const HOME = '/';
export const SIGN_IN = '/sign-in';
export const SIGN_UP = '/sign-up';
export const ADMIN_HOME = '/admin';

export const USER_HOME = '/user';
export const USER_LESSONS = `${USER_HOME}/lessons`;
export const LESSON_PAGE = `${USER_LESSONS}/:id`;
export const USER_ENROLL = `${USER_HOME}/enroll/:id`;

export const TEACHER_HOME = '/teacher';
export const LESSONS_NEW = `${TEACHER_HOME}/lessons/new`;
export const LESSONS_EDIT = `${TEACHER_HOME}/lessons/:id`;
