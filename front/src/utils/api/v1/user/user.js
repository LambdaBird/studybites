import axios from 'axios';
import { sleep } from '../../../utils';

const PATH = '/api/v1/user';

export const postSignUp = async (formData) => {
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

const getUsersRequestMocked = async ({ offset, limit, search }) => {
  let data = new Array(500).fill(1).map((x, i) => ({
    key: i,
    fullName: `A${i + 1}`,
    email: `Email${i + 1}`,
    role: 'teacher',
  }));
  if (search) {
    data = data.filter(
      (x) => x.email.includes(search) || x.fullName.includes(search),
    );
  }
  await sleep(500);
  return {
    status: 200,
    data: {
      total: data.length,
      data: data.slice(offset, offset + limit),
    },
  };
};

export const getUsers = async (paramsData) => {
  try {
    /*
    const { status, data } = await axios.get(`${PATH}/`, {
      params: paramsData,
    });
     */
    return await getUsersRequestMocked(paramsData);
  } catch (e) {
    const { status, data } = e.response;
    return {
      status,
      data,
    };
  }
};
