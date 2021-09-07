import api from '@sb-ui/utils/api';

const PATH = '/api/v1/status-management';

export const postStatus = async (params) => {
  const { data } = await api.post(`${PATH}/lessons/${params.id}`, params);
  return data;
};
