import axios from 'axios';

const PATH = '/api/v1/user';

export const signUp = async (formData) => {
  try {
    const { status, data } = await axios.post(`${PATH}/signup`, {
      ...formData,
      secondName: formData.lastName,
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
