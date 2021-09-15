import build from '../../src/app';
import { authorizeUser } from './utils';
import { defaultPassword, teacherMike } from '../../seeds/testData/users';

describe('PATCH /api/v1/user/self', () => {
  const testContext = {};
  const teacherCredentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();
    await authorizeUser({
      credentials: teacherCredentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.token = accessToken;
      },
    });
    testContext.request = async ({ method = 'PATCH', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/user/self`,
        headers: {
          Authorization: `Bearer ${testContext.token}`,
        },
        body,
      });
    };
    await testContext.app.ready();
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  it.each([
    {
      firstName: 'GoodName',
      lastName: 'GoodLastName',
      email: 'valid@mail.ru',
    },
    {
      firstName: 'A',
      lastName: 'B',
      email: 'valid@mail.ru',
    },
    {
      firstName: 'Test',
    },
  ])('should return success with %s', async (body) => {
    const response = await testContext.request({ body });
    const payload = JSON.parse(response.payload);
    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject(body);
  });

  it.each([
    [
      {
        firstName: 'Good name',
        lastName: 'GoodLastName',
        email: 'valid@mail.ru',
      },
      'errors.invalid_user_body',
    ],
    [
      { firstName: 'A      a', lastName: 'B', email: 'valid@mail.ru' },
      'errors.invalid_user_body',
    ],
    [
      { firstName: '', lastName: 'B', email: 'valid@mail.ru' },
      'validation.minLength.firstName',
    ],
    [
      { firstName: '', lastName: '', email: 'valid@mail.ru' },
      'validation.minLength.firstName',
    ],
    [
      {
        email: 'notvalid',
      },
      'validation.pattern.email',
    ],
    [
      {
        firstName: 'toolong'.repeat(50),
      },
      'validation.maxLength.firstName',
    ],
  ])('should return fail with %s', async (body, errorMessage) => {
    const response = await testContext.request({ body });
    const payload = JSON.parse(response.payload);
    expect(response.statusCode).toBe(400);
    expect(payload.message).toBe(errorMessage);
  });
});
