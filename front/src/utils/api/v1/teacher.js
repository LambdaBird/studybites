import api from '@sb-ui/utils/api';

const PATH = '/api/v1/lesson';

export const createLesson = async (values) => {
  const { data } = await api.post(`${PATH}/maintain/`, values);
  return data;
};

export const putLesson = async (params) => {
  const { data } = await api.put(
    `${PATH}/maintain/${params.lesson.id}`,
    params,
  );
  return data;
};

export const getLesson = async ({ queryKey }) => {
  const [, { id }] = queryKey;

  const { data } = await api.get(`${PATH}/maintain/${id}`);
  return data;
};

export const getTeacherLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/maintain/`, {
    params: paramsData,
  });

  return data;
};

export const getTeacherStudents = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/maintain/students`, {
    params: paramsData,
  });

  return data;
};

export const getTeacherLessonStudents = async ({ queryKey }) => {
  const [, { lessonId, offset, limit, search }] = queryKey;

  const { data } = await api.get(`${PATH}/enrolled/${lessonId}`, {
    params: {
      offset,
      limit,
      search,
    },
  });

  return {
    ...data,
    students: data.students.map((x) => ({
      ...x,
      fullName: `${x.firstName} ${x.lastName}`,
    })),
  };
};
