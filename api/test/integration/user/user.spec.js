import jest from 'jest-mock';
import {
  UNAUTHORIZED,
  USER_ADMIN_FIELDS,
} from '../../../src/services/user/constants';
import build from '../../../src/app';
import { signinBodyValid, signupBodyValid } from './constants';

describe('Test user (self) route:', () => {
  let app;
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
    const res = await app.objection.models.user
      .query()
      .select(USER_ADMIN_FIELDS)
      .whereNot({
        isSuperAdmin: true,
      })
      .del();
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
    expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);

    Date.now = originDateNow;
  });
});
