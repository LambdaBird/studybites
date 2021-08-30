import api from '@sb-ui/utils/api';

const PATH = '/api/v1/lessons';

export const getLesson = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/${id}`);
  return data;
};

export const enrollLesson = async (id) => {
  const { data } = await api.post(`${PATH}/${id}/enroll`);
  return data;
};

export const getLessons = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}`, {
    params: paramsData,
  });
  return data;
};
