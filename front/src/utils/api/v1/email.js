import api from '@sb-ui/utils/api';

const PATH = '/api/v1/email';

export const resetPassword = async () => {
  const { data } = await api.post(`${PATH}/reset-password`);
  return data;
};

export const resetPasswordNoAuth = async (params) => {
  const { data } = await api.post(`${PATH}/reset-password-no-auth`, params);
  return data;
};

export const verifyPasswordReset = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/verify-password-reset/${id}`);
  return data;
};

export const verifyEmail = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/verify-email/${id}`);
  return data;
};

export const updatePassword = async (params) => {
  const { data } = await api.put(
    `${PATH}/update-password/${params.id}`,
    params,
  );
  return data;
};
