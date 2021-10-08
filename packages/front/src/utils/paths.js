export const HOME = '/';
export const SIGN_IN = '/sign-in';
export const SIGN_UP = '/sign-up';
export const ADMIN_HOME = '/admin';
export const CHANGE_PASSWORD = '/change-password/:id';
export const VERIFY_EMAIL = '/verify-email/:id';
export const EMAIL_SENT = '/email-sent';
export const FORGOT_PASSWORD = '/forgot-password';

export const PROFILE = '/profile';
export const USER_HOME = '/user';
export const USER_LESSONS = `${USER_HOME}/lessons`;
export const USER_COURSES = `${USER_HOME}/courses`;
export const LEARN_PAGE = `${USER_LESSONS}/learn/:id`;
export const LEARN_COURSE_PAGE = `${USER_COURSES}/learn/:id`;
export const USER_ENROLL_LESSON = `${USER_HOME}/enroll/lesson/:id`;
export const USER_ENROLL_COURSE = `${USER_HOME}/enroll/course/:id`;

export const TEACHER_HOME = '/teacher';
export const TEACHER_STUDENTS = `${TEACHER_HOME}/students`;
export const LESSONS_NEW = `${TEACHER_HOME}/lessons/new`;
export const COURSES_NEW = `${TEACHER_HOME}/courses/new`;
export const LESSONS_EDIT = `${TEACHER_HOME}/lessons/:id`;
export const COURSES_EDIT = `${TEACHER_HOME}/courses/:id`;
export const TEACHER_LESSONS_STUDENTS = `${LESSONS_EDIT}/students`;
export const LESSONS_PREVIEW = `${TEACHER_HOME}/lessons/preview/:id`;
