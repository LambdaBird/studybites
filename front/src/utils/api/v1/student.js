import api from '@sb-ui/utils/api';

const PATH = '/api/v1/lesson';

export const getLessonById = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/${id}`);
  return data;
};

export const postLessonById = async (paramsData) => {
  const { data } = await api.post(`${PATH}/${paramsData.id}/learn`, paramsData);

  return data;
};

export const getEnrolledLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/enrolled/`, {
    params: paramsData,
  });

  return data;
};

export const postEnroll = async (id) => {
  const { data } = await api.post(`${PATH}/enroll/${id}`);
  return data;
};

export const getEnrolledLesson = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/enroll/${paramsData.id}`);

  return data;
};

export const getEnrolledLessonsFinished = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/enrolled-finished/`, {
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
