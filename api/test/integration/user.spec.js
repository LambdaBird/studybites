import jest from 'jest-mock';
import build from '../../src/app';
import {
  UNAUTHORIZED,
  USER_ALREADY_REGISTERED,
} from '../../src/services/user/constants';
import { EMPTY_BODY } from '../../src/validation/validatorCompiler';

const app = build();

afterAll(async () => {
  await app.close();
});

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

    Date.now = jest.fn(() => Date.now);
  });
});
