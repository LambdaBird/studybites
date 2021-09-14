import api from '@sb-ui/utils/api';

const PATH = '/api/v1/courses';

export const getCourses = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}`, {
    params: paramsData,
  });
  return data;
};

export const getCourse = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/${id}`);
  return data;
};

export const enrollCourse = async (id) => {
  const { data } = await api.post(`${PATH}/${id}/enroll`);
  return data;
};
