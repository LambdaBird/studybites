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
