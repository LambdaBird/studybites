import api from '@sb-ui/utils/api';

const PATH = '/api/v1/user';

export const postSignUp = async (formData) => {
  try {
    const { status, data } = await api.post(`${PATH}/signup`, {
      ...formData,
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

export const postSignIn = async (formData) => {
  try {
    const { status, data } = await api.post(`${PATH}/signin`, {
      ...formData,
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

export const getUser = async () => {
  const { data } = await api.get(`${PATH}/self`);

  return data || {};
};
