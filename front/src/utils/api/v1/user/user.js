import axios from 'axios';
import { getJWTAccessToken } from '../../../jwt';

const PATH = '/api/v1/user';

export const postSignUp = async (formData) => {
  try {
    const { status, data } = await axios.post(`${PATH}/signup`, {
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

export const getUsers = async (paramsData) => {
  try {
    const { status, data } = await axios.get(`${PATH}/`, {
      headers: {
        Authorization: `Bearer ${getJWTAccessToken()}`,
      },
      params: paramsData,
    });
    return {
      status,
      data: {
        ...data,
        data: data.data.map((x) => ({
          ...x,
          fullName: `${x.firstName} ${x.secondName}`,
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
    const { status, data } = await axios.post(
      `${PATH}/appoint_teacher`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${getJWTAccessToken()}`,
        },
      },
    );
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
    const { status, data } = await axios.post(
      `${PATH}/remove_teacher`,
      { id },
      {
        headers: {
          Authorization: `Bearer ${getJWTAccessToken()}`,
        },
      },
    );
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
    const { status, data } = await axios.get(`${PATH}/self`, {
      headers: {
        Authorization: `Bearer ${getJWTAccessToken()}`,
      },
    });

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
