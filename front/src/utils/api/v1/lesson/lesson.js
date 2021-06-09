import axios from 'axios';
import { getJWTAccessToken } from '../../../jwt';

const PATH = '/api/v1/lesson';

export const getLessons = async (paramsData) => {
  try {
    const { status, data } = await axios.get(`${PATH}/`, {
      headers: {
        Authorization: `Bearer ${getJWTAccessToken()}`,
      },
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
    const { status, data } = await axios.post(
      `${PATH}/enroll/${id}`,
      {},
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

export const getEnrolledLessons = async (paramsData) => {
  try {
    const { status, data } = await axios.get(`${PATH}/enrolled/`, {
      headers: {
        Authorization: `Bearer ${getJWTAccessToken()}`,
      },
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
