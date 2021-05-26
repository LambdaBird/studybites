import {
  USER_ADMIN_FIELDS,
  USER_ALREADY_REGISTERED,
} from '../../../src/services/user/constants';
import build from '../../../src/app';
import { missingBody, signupBodyValid } from './constants';

describe('Test signup route:', () => {
  let app;

  beforeAll(async () => {
    app = build();
    await app.ready();
  });

  afterAll(async () => {
    await app.objection.models.user
      .query()
      .select(USER_ADMIN_FIELDS)
      .whereNot({
        isSuperAdmin: true,
      })
      .del();
    await app.close();
  });

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
