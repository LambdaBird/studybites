export const TEACHER_STUDENTS_BASE_KEY = 'teacherStudents';

export const MAX_STUDENTS_IN_LIST = 10;

export const itemPerPage = [...new Array(MAX_STUDENTS_IN_LIST)].map(
  (_, index) => ({
    id: `skeleton ${index}`,
  }),
);
