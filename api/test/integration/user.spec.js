import app from '../../src/index';

afterAll(async () => {
  await app.close();
});

const signupBodyValid = {
  email: 'valid@test.io',
  password: 'valid3',
  firstName: 'Valid',
  secondName: 'Valid',
};

const signupSuccess = {
  key: 'signup.action_success',
  message: 'Successfully signed up',
};

const signupConflict = {
  fallback: 'errors.unique_violation',
  errors: [
    'insert into "users" ("email", "first_name", "password", "second_name") values ($1, $2, $3, $4) returning "id" - duplicate key value violates unique constraint "users_email_unique"'
  ],
};

const signupMissingBody = {
  fallback: 'errors.validation_error',
  errors: [ { key: 'errors.empty_body', message: 'Body must be an object' } ],
};

describe('Test user service:', () => {
  it('should return 201 for valid data', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      payload: signupBodyValid,
    });

    expect(response.statusCode).toBe(201);
    expect(JSON.parse(response.payload)).toMatchObject(signupSuccess);
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
    expect(JSON.parse(response.payload)).toMatchObject(signupMissingBody);
  });
});
