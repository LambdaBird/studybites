import axios from 'axios';

const PATH = '/api/v1/user';

export const postSignIn = async (formData) => {
  try {
    const { status, data } = await axios.post(`${PATH}/signin`, {
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
