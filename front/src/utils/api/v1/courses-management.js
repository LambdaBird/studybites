import api from '@sb-ui/utils/api';

const PATH = '/api/v1/courses-management';

export const getTeacherCourses = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/courses`, {
    params: paramsData,
  });

  return data;
};
