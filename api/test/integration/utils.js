export const authorizeUser = async ({
  credentials,
  app,
  setToken,
}) => {
  await app.ready();

  const response = await app.inject({
    method: 'POST',
    url: '/api/v1/user/signin',
    payload: credentials,
  });

  const data = JSON.parse(response.payload);

  setToken(data.accessToken);
};
