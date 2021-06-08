/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */

import axios from 'axios';
import { getJWTAccessToken, getJWTRefreshToken } from '../jwt';

export const api = axios.create();

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
    if (
      refreshToken &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(`/api/v1/user/refresh_token`, {
          refreshToken,
        });

        if (res.status === 200) {
          localStorage.setItem('accessToken', res.data.accessToken);
          localStorage.setItem('refreshToken', res.data.refreshToken);
          return api(originalRequest);
        }
      } catch (e) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  },
);
