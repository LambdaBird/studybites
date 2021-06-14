import api from '@sb-ui/utils/api';

const PATH = '/api/v1/lesson';

export const getLessons = async (paramsData) => {
  try {
    const { status, data } = await api.get(`${PATH}/`, {
      params: paramsData,
    });
    return { status, data };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};

export const getLessonById = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;

  const { data } = await api.get(`${PATH}/${id}`, {
    params: paramsData,
  });

  return data;
};

export const postEnroll = async (id) => {
  try {
    const { status, data } = await api.post(`${PATH}/enroll/${id}`, {});
    return { status, data };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};

export const getEnrolledLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/enrolled/`, {
    params: paramsData,
  });

  return data;
};

export const createLesson = async (values) => {
  const { data } = await api.post(`${PATH}/maintain/`, values);
  return data;
};

export const archiveLesson = async ({ status, id }) => {
  const { data } = await api.patch(`${PATH}/maintain/${id}`, { status });
  return data;
};

export const getTeacherLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/maintain/`, {
    params: paramsData,
  });

  return data;
};

export const getPublicLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/`, {
    params: paramsData,
  });

  return data;
};
