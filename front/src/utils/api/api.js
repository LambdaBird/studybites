/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import { message } from 'antd';
import axios from 'axios';

import i18n from '@sb-ui/i18n';

import {
  clearJWT,
  getJWTAccessToken,
  getJWTRefreshToken,
  setJWT,
} from '../jwt';

export const api = axios.create({
  baseURL: 'https://poc.studybites.app:3017',
});

// request interceptor to add the auth token header to requests
api.interceptors.request.use(
  (config) => {
    const accessToken = getJWTAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

// response interceptor to refresh token on receiving token expired error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const refreshToken = getJWTRefreshToken();
    if (error.response.status === 500) {
      message.error({
        key: 'errors.internal_server',
        content: i18n.t('errors.internal_server'),
        duration: 3,
      });
    }
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        if (!refreshToken) {
          clearJWT();
          return Promise.reject(error);
        }
        const res = await axios.post(`/api/v1/user/refresh_token`, {
          refreshToken,
        });

        if (res.status === 200) {
          setJWT({
            accessToken: res.data.accessToken,
            refreshToken: res.data.refreshToken,
          });
          return api(originalRequest);
        }
      } catch (e) {
        clearJWT();
      }
    }
    return Promise.reject(error);
  },
);
