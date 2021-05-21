const ACCESS_TOKEN = 'accessToken';
const REFRESH_TOKEN = 'refreshToken';

export const getJWTAccessToken = () => localStorage.getItem(ACCESS_TOKEN);

export const getJWTRefreshToken = () => localStorage.getItem(REFRESH_TOKEN);

export const setJWT = ({ accessToken, refreshToken }) => {
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const clearJWT = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
};
