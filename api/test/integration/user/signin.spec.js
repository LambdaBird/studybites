import build from '../../../src/app';
import { UNAUTHORIZED } from '../../../src/services/user/constants';
import { EMPTY_BODY } from '../../../src/validation/validatorCompiler';

import { signupBodyWrongEmail, signupBodyWrongPassword } from './constants';

describe('Test signin route:', () => {
  let app;

  const signupBodyValid = {
    email: 'valid3@test.io',
    password: 'valid3',
    firstName: 'Valid3',
    lastName: 'Valid3',
  };

  const signinBodyValid = {
    email: 'valid3@test.io',
    password: 'valid3',
  };

  beforeAll(async () => {
    app = build();

    await app.ready();

    await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });
  });

  afterAll(async () => {
    await app.close();
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
    expect(JSON.parse(response.payload).errors[0]).toMatchObject(UNAUTHORIZED);
  });

  it('should return 401 for wrong password', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: signupBodyWrongPassword,
    });

    expect(response.statusCode).toBe(401);
    expect(JSON.parse(response.payload).errors[0]).toMatchObject(UNAUTHORIZED);
  });

  it('should return 400 for missing body', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
    });

    expect(response.statusCode).toBe(400);
    expect(JSON.parse(response.payload).errors[0]).toMatchObject(EMPTY_BODY);
  });
});
