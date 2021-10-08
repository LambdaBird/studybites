import api from '@sb-ui/utils/api';

const PATH = '/api/v1/user';

export const getUsers = async ({ queryKey }) => {
  const [, paramsData] = queryKey;

  const { data } = await api.get(`${PATH}/`, {
    params: paramsData,
  });

  return {
    ...data,
    data: data.data.map((x) => ({
      ...x,
      fullName: `${x.firstName} ${x.lastName}`,
    })),
  };
};

export const appointTeacher = async (id) => {
  const { data } = await api.post(`${PATH}/appoint_teacher`, { id });
  return data;
};

export const removeTeacher = async (id) => {
  const { data } = await api.post(`${PATH}/remove_teacher`, { id });
  return data;
};
