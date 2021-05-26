import jest from 'jest-mock';
import build from '../../src/app';
import {
  INVALID_EMPTY_BODY,
  INVALID_ID,
  INVALID_ID_FULL,
  INVALID_PATCH,
  UNAUTHORIZED,
  USER_ALREADY_REGISTERED,
  USER_DELETED,
  USER_NOT_FOUND,
} from '../../src/services/user/constants';
import { EMPTY_BODY } from '../../src/validation/validatorCompiler';

const app = build();

afterAll(async () => {
  await app.close();
});

const signinBodyAdmin = {
  email: 'admin@test.io',
  password: 'passwd3',
};

const signupBodyValid = {
  email: 'valid@test.io',
  password: 'valid3',
  firstName: 'Valid',
  secondName: 'Valid',
};

const signinBodyValid = {
  email: 'valid@test.io',
  password: 'valid3',
};

const signupBodyWrongEmail = {
  email: 'invalid@test.io',
  password: 'valid3',
};

const signupBodyWrongPassword = {
  email: 'valid@test.io',
  password: 'invalid3',
};

const missingBody = {
  fallback: 'errors.validation_error',
  errors: [EMPTY_BODY],
};

describe('Test signup route:', () => {
  it('should return 201 for valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toHaveProperty('accessToken');
    expect(JSON.parse(response.payload)).toHaveProperty('refreshToken');
  });

  it('should return 409 for existing data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });

    expect(response.statusCode).toBe(409);
    expect(JSON.parse(response.payload)).toMatchObject(USER_ALREADY_REGISTERED);
  });

  it('should return 400 for missing body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toMatchObject(missingBody);
  });
});

describe('Test signin route:', () => {
  it('should return 200 for valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signinBodyValid,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toHaveProperty('accessToken');
    expect(JSON.parse(response.payload)).toHaveProperty('refreshToken');
  });

  it('should return 401 for user not in db', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signupBodyWrongEmail,
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);
  });

  it('should return 401 for wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signupBodyWrongPassword,
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);
  });

  it('should return 400 for missing body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toMatchObject(missingBody);
  });
});

describe('Test self route:', () => {
  const tokens = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signinBodyValid,
    });

    const data = JSON.parse(response.payload);
    tokens.access = data.accessToken;
    tokens.refresh = data.refreshToken;
  });

  it('should return 200 for a valid access token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/self',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
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

describe('Test user route:', () => {
  const tokensAdmin = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  const tokensUser = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
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
    it('should return 400 for user id that is admin', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user/1',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject(INVALID_ID_FULL);
    });

    it('should return 401 for no admin', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user/1',
        headers: {
          Authorization: `Bearer ${tokensUser.access}`,
        },
      });
      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);
    });

    it('should return 200 for user that exists', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user/2',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toHaveProperty('data');
    });
    it('should return 404 for user that not exists', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/v1/user/999',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.payload)).toMatchObject(USER_NOT_FOUND);
    });
  });

  describe('Test PATCH /:id route:', () => {
    it('should return 401 for no admin', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/user/1',
        headers: {
          Authorization: `Bearer ${tokensUser.access}`,
        },
      });
      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);
    });

    it('should return 400 for user id that is admin', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/user/1',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
        body: {
          firstName: 'Test',
        },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject(INVALID_ID_FULL);
    });

    it('should return 400 for user that not exists', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/user/999',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
        body: {
          firstName: 'New test',
        },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject(INVALID_PATCH);
    });

    it('should return 400 for empty body', async () => {
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/user/999',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject(INVALID_EMPTY_BODY);
    });

    it('should return 200 for valid data', async () => {
      const NEW_FIRSTNAME = 'New firstName';
      const response = await app.inject({
        method: 'PATCH',
        url: '/api/v1/user/2',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
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
    it('should return 401 for no admin', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/user/1',
        headers: {
          Authorization: `Bearer ${tokensUser.access}`,
        },
      });
      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toMatchObject(UNAUTHORIZED);
    });

    it('should return 400 for user id that is admin', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/user/1',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject(INVALID_ID_FULL);
    });

    it('should return 404 for user that not exists', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/user/999',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.payload)).toMatchObject(USER_NOT_FOUND);
    });

    it('should return 204 for valid data', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/api/v1/user/2',
        headers: {
          Authorization: `Bearer ${tokensAdmin.access}`,
        },
      });
      expect(response.statusCode).toBe(204);
      expect(JSON.parse(response.payload)).toMatchObject(USER_DELETED);
    });
  });
});
