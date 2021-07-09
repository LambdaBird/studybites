import build from '../../src/app';

import { authorizeUser } from './utils';

describe('OPTIONS /api/v1/lesson', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an array of possible lesson statuses', async () => {
    const response = await app.inject({
      method: 'OPTIONS',
      url: '/api/v1/lesson',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('properties');
  });
});
