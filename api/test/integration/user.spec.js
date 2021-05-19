import jest from 'jest-mock';

import app from '../../src/server';

afterAll(async () => {
  await app.close();
});

const tokens = {
  access: null,
  refresh: null,
  malformed: 'malformedtoken',
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

const signupConflict = {
  fallback: 'errors.unique_violation',
  errors: [
    {
      key: 'sign_up.email.already_registered',
      message: 'This email was already registered',
    },
  ],
};

const missingBody = {
  fallback: 'errors.validation_error',
  errors: [{ key: 'errors.empty_body', message: 'Body must be an object' }],
};

const signinUnauthorized = {
  fallback: 'errors.unauthorized',
  errors: [
    {
      message: 'Unauthorized',
    },
  ],
};

describe('Test user service:', () => {
  it('should return 201 for valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });

    const data = JSON.parse(response.payload);
    tokens.access = data.accessToken;
    tokens.refresh = data.refreshToken;

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
    expect(JSON.parse(response.payload)).toMatchObject(signupConflict);
  });

  it('should return 400 for missing body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toMatchObject(missingBody);
  });

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
    expect(JSON.parse(response.payload)).toMatchObject(signinUnauthorized);
  });

  it('should return 401 for wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signupBodyWrongPassword,
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toMatchObject(signinUnauthorized);
  });

  it('should return 400 for missing body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload)).toMatchObject(missingBody);
  });

  it('should return 200 for a valid access token', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user',
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
      url: '/api/v1/user',
      headers: {
        Authorization: `Bearer ${tokens[payload]}`,
      },
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload)).toMatchObject(signinUnauthorized);

    Date.now = jest.fn(() => Date.now);
  });
});
