import {
  INVALID_EMPTY_BODY,
  INVALID_ID_FULL,
  INVALID_PATCH,
  UNAUTHORIZED,
  USER_DELETED,
  USER_NOT_FOUND,
} from '../../../src/services/user/constants';
import build from '../../../src/app';
import { signinBodyAdmin, signinBodyValid, signupBodyValid } from './constants';

describe('Test admin route:', () => {
  let app;
  const signupBodyValid = {
    email: 'valid4@test.io',
    password: 'valid3',
    firstName: 'Valid4',
    secondName: 'Valid4',
  };
  const signinBodyValid = {
    email: 'valid4@test.io',
    password: 'valid3',
  };
  const tokensAdmin = {
    access: null,
    refresh: null,
  };
  const tokensUser = {
    access: null,
    refresh: null,
  };

  beforeAll(async () => {
    app = build();
    await app.ready();
    await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });

    const adminResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signinBodyAdmin,
    });

    const adminData = JSON.parse(adminResponse.payload);
    tokensAdmin.access = adminData.accessToken;
    tokensAdmin.refresh = adminData.refreshToken;

    const userResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signinBodyValid,
    });

    const userData = JSON.parse(userResponse.payload);
    tokensUser.access = userData.accessToken;
    tokensUser.refresh = userData.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Test GET / route', () => {
    it('should return 200 for admin body', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('data');
    });

    it('should return 401 for user body', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user',
        headers: {
          Authorization: `Bearer ${tokensUser.access}`,
        },
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);
    });
  });

  describe('Test GET /:id route:', () => {
    it.each([
      ['400 for user id that is admin', '1', 'admin', 400, INVALID_ID_FULL],
      ['401 for no admin', '1', 'user', 401, UNAUTHORIZED],
      ['404 for user that not exists', '999', 'admin', 404, USER_NOT_FOUND],
    ])('should return %s', async (_, userId, role, code, payload) => {
      const response = await app.inject({
        method: 'GET',
        url: `/api/v1/user/${userId}`,
        headers: {
          Authorization: `Bearer ${
            role === 'user' ? tokensUser['access'] : tokensAdmin['access']
          }`,
        },
      });
      expect(response.statusCode).toBe(code);
      expect(JSON.parse(response.payload)).toMatchObject(payload);
    });

    it('should return 200 for user that exists', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user/2',
        headers: {
          Authorization: `Bearer ${tokensAdmin['access']}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('data');
    });
  });

  describe('Test PATCH /:id route:', () => {
    it.each([
      ['401 for no admin', '1', null, 'user', 401, UNAUTHORIZED],
      [
        '400 for user id that is admin',
        '1',
        { firstName: 'Test' },
        'admin',
        400,
        INVALID_ID_FULL,
      ],
      [
        '400 for user that not exists',
        '999',
        { firstName: 'Test' },
        'admin',
        400,
        INVALID_PATCH,
      ],
      ['400 for empty body', '999', null, 'admin', 400, INVALID_EMPTY_BODY],
    ])('should return %s', async (_, userId, body, role, code, payload) => {
      const response = await app.inject({
        method: 'PATCH',
        url: `/api/v1/user/${userId}`,
        headers: {
          Authorization: `Bearer ${
            role === 'user' ? tokensUser['access'] : tokensAdmin['access']
          }`,
        },
        body: body,
      });

      expect(response.statusCode).toBe(code);
      expect(JSON.parse(response.payload)).toMatchObject(payload);
    });

    it('should return 200 for valid data', async () => {
      const NEW_FIRSTNAME = 'New firstName';
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/user/2',
        headers: {
          Authorization: `Bearer ${tokensAdmin['access']}`,
        },
        body: {
          firstName: NEW_FIRSTNAME,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload).data).toMatchObject({
        firstName: NEW_FIRSTNAME,
      });
    });
  });

  describe('Test DELETE /:id route:', () => {
    it.each([
      ['401 for no admin', '1', 'user', 401, UNAUTHORIZED],
      ['400 for user id that is admin', '1', 'admin', 400, INVALID_ID_FULL],
      ['404 for user that not exists', '999', 'admin', 404, USER_NOT_FOUND],
      ['204 for valid data', '2', 'admin', 204, USER_DELETED],
    ])('should return %s', async (_, userId, role, code, payload) => {
      const response = await app.inject({
        method: 'DELETE',
        url: `/api/v1/user/${userId}`,
        headers: {
          Authorization: `Bearer ${
            role === 'user' ? tokensUser['access'] : tokensAdmin['access']
          }`,
        },
      });
      expect(response.statusCode).toBe(code);
      expect(JSON.parse(response.payload)).toMatchObject(payload);
    });
  });
});
