import jest from 'jest-mock';

import build from '../../../src/app';
import { UNAUTHORIZED } from '../../../src/services/user/constants';

describe('Test user (self) route:', () => {
  let app;

  const signupBodyValid = {
    email: 'valid5@test.io',
    password: 'valid3',
    firstName: 'Valid',
    lastName: 'Valid',
  };

  const signinBodyValid = {
    email: 'valid5@test.io',
    password: 'valid3',
  };

  const tokens = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
    app = build();

    await app.ready();

    await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signinBodyValid,
    });

    const data = JSON.parse(response.payload);

    tokens.access = data.accessToken;
    tokens.refresh = data.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return 200 for a valid access token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/self',
      headers: {
        Authorization: `Bearer ${tokens['access']}`,
      },
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toHaveProperty('data');
  });

  it.each([
    ['an valid refresh token', 'refresh'],
    ['an expired token', 'access'],
    ['a malformed token', 'malformed'],
  ])('should return 401 for %s', async (_, payload) => {
    const originDateNow = Date.now;

    Date.now = jest.fn(() => 2687076708000);

    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/self',
      headers: {
        Authorization: `Bearer ${tokens[payload]}`,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload).errors[0]).toMatchObject(UNAUTHORIZED);

    Date.now = originDateNow;
  });
});
