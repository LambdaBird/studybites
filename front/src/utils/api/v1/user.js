import { PAGE_SIZE } from '@sb-ui/pages/User/Lessons/LessonsList/constants';
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
  const { data: user } = await api.get(`${PATH}/self`);
  const {
    data: { location },
  } = await api.get(`/api/v1/files/Screenshot from 2021-09-10 20-11-07.png`);

  return { ...user, image: location };
};

export const patchLanguage = async ({ language }) => {
  const { data } = await api.patch(`${PATH}/language`, {
    language,
  });
  return data;
};

export const fetchAuthors = async ({ search = '' } = {}) => {
  const {
    data: { authors },
  } = await api.get(`${PATH}/authors`, {
    params: {
      offset: 0,
      limit: PAGE_SIZE,
      search,
    },
  });

  return authors.map(({ id, firstName, lastName }) => ({
    value: id,
    label: `${firstName} ${lastName}`,
  }));
};
