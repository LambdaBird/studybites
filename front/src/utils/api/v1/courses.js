import api from '@sb-ui/utils/api';

const PATH = '/api/v1/courses';

export const getCourses = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}`, {
    params: paramsData,
  });
  return data;
};
