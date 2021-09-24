import api from '@sb-ui/utils/api';

const PATH = '/api/v1/email';

export const resetPassword = async () => {
  const { data } = await api.post(`${PATH}/reset_password`);
  return data;
};

export const resetPasswordNoAuth = async (params) => {
  const { data } = await api.post(`${PATH}/reset_password_no_auth`, params);
  return data;
};

export const verifyPasswordReset = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/verify_password_reset/${id}`);
  return data;
};

export const verifyPasswordResetNoAuth = async ({ queryKey }) => {
  const [, paramsData] = queryKey;
  const { id } = paramsData;
  const { data } = await api.get(`${PATH}/verify_password_reset_no_auth/${id}`);
  return data;
};

export const updatePassword = async (params) => {
  const { data } = await api.put(
    `${PATH}/update_password/${params.id}`,
    params,
  );
  return data;
};

export const updatePasswordNoAuth = async (params) => {
  const { data } = await api.put(
    `${PATH}/update_password_no_auth/${params.id}`,
    params,
  );
  return data;
};
