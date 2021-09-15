import api from '@sb-ui/utils/api';

const PATH = '/api/v1/lessons-management';

export const createLesson = async (values) => {
  const { data } = await api.post(`${PATH}/lessons`, values);
  return data;
};

export const putLesson = async (params) => {
  const { data } = await api.put(`${PATH}/lessons/${params.lesson.id}`, params);
  return data;
};

export const getLesson = async ({ queryKey }) => {
  const [, { id }] = queryKey;

  const { data } = await api.get(`${PATH}/lessons/${id}`);
  return data;
};

export const getTeacherLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/lessons`, {
    params: paramsData,
  });

  return data;
};

export const getTeacherStudents = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/students`, {
    params: paramsData,
  });

  return {
    ...data,
    students: data.students.map((x) => ({
      ...x,
      fullName: `${x.firstName || ''} ${x.lastName || ''}`,
    })),
  };
};

export const getTeacherLessonStudents = async ({ queryKey }) => {
  const [, { lessonId, offset, limit, search }] = queryKey;

  const { data } = await api.get(`${PATH}/lessons/${lessonId}/students`, {
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
      fullName: `${x.firstName || ''} ${x.lastName || ''}`,
    })),
  };
};

export const patchLessonStatus = async (params) => {
  const { data } = await api.patch(
    `${PATH}/lessons/${params.id}/update-status`,
    params,
  );
  return data;
};
