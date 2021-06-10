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

export const getUsers = async (paramsData) => {
  try {
    const { status, data } = await api.get(`${PATH}/`, {
      params: paramsData,
    });
    return {
      status,
      data: {
        ...data,
        data: data.data.map((x) => ({
          ...x,
          fullName: `${x.firstName} ${x.lastName}`,
        })),
      },
    };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};

export const appointTeacher = async (id) => {
  try {
    const { status, data } = await api.post(`${PATH}/appoint_teacher`, { id });
    return { status, data };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};

export const removeTeacher = async (id) => {
  try {
    const { status, data } = await api.post(`${PATH}/remove_teacher`, { id });
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
  try {
    const { status, data } = await api.get(`${PATH}/self`);

    return {
      status,
      data,
    };
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
