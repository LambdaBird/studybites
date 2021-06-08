import api from '@sb-ui/utils/api';

const PATH = '/api/v1/lesson';

export const getLessons = async (paramsData) => {
  try {
    const { status, data } = await api.get(`${PATH}/`, {
      params: paramsData,
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

export const postEnroll = async (id) => {
  try {
    const { status, data } = await api.post(`${PATH}/enroll/${id}`, {});
    return { status, data };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
