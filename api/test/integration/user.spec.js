import build from '../../src/app';
import {
  ALTER_ROLE_FAIL,
  ALTER_ROLE_SUCCESS,
  UNAUTHORIZED,
  USER_ALREADY_REGISTERED,
  USER_DELETED,
  USER_NOT_FOUND,
  USER_ROLE_NOT_FOUND,
} from '../../src/services/user/constants';

describe('POST /api/v1/user/signup', () => {
  const app = build();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return access and refresh tokens', async () => {
    const body = {
      email: 'newuser@test.io',
      password: 'passwd3',
      firstName: 'New',
      lastName: 'User',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(201);
    expect(payload).toHaveProperty('accessToken');
    expect(payload).toHaveProperty('refreshToken');
  });

  it('should return an error for existing data', async () => {
    const body = {
      email: 'newuser@test.io',
      password: 'passwd3',
      firstName: 'New',
      lastName: 'User',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signup',
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(409);
    expect(payload.errors[0]).toMatchObject(USER_ALREADY_REGISTERED);
  });
});

describe('POST /api/v1/user/signin', () => {
  const app = build();

  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return access and refresh tokens', async () => {
    const body = {
      email: 'john@test.io',
      password: 'passwd3',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('accessToken');
    expect(payload).toHaveProperty('refreshToken');
  });

  it('should return an error for wrong password', async () => {
    const body = {
      email: 'john@test.io',
      password: 'passwd33',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(401);
    expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
  });

  it('should return an error for non-existing user', async () => {
    const body = {
      email: 'missing@test.io',
      password: 'passwd3',
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(401);
    expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
  });
});

describe('POST /api/v1/user/refresh_token', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'john@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return new access and refresh tokens', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/refresh_token',
      body: {
        refreshToken: token,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('accessToken');
    expect(payload).toHaveProperty('refreshToken');
  });
});

describe('GET /api/v1/user/self', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'john@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return new access and refresh tokens', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/self',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('email');
    expect(payload).toHaveProperty('roles');
  });
});

describe('GET /api/v1/user', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'admin@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return users and total', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('data');
    expect(payload).toHaveProperty('total');
  });

  it('should return no users', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user?search=nomatch',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('data');
    expect(payload).toHaveProperty('total');
    expect(payload.total).toBe(0);
  });
});

describe('GET /api/v1/user/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'admin@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a user', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/101',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('data');
  });

  it('should return an error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/1000',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(404);
    expect(payload.errors[0]).toMatchObject(USER_NOT_FOUND);
  });
});

describe('PATCH /api/v1/user/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'admin@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a user', async () => {
    const response = await app.inject({
      method: 'PATCH',
      url: '/api/v1/user/104',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        firstName: 'Newname',
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('data');
    expect(payload.data.firstName).toBe('Newname');
  });

  it('should return an error', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/user/1000',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(404);
    expect(payload.errors[0]).toMatchObject(USER_NOT_FOUND);
  });
});

describe('DELETE /api/v1/user/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'admin@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a success message', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/v1/user/104',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject(USER_DELETED);
  });

  it('should return an error', async () => {
    const response = await app.inject({
      method: 'DELETE',
      url: '/api/v1/user/1000',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(404);
    expect(payload.errors[0]).toMatchObject(USER_NOT_FOUND);
  });
});

describe('POST /api/v1/user/appoint_teacher', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'admin@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a success message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/appoint_teacher',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        id: 103,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject(ALTER_ROLE_SUCCESS);
  });

  it('should return an error', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/appoint_teacher',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        id: 103,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);
    expect(payload.errors[0]).toMatchObject(ALTER_ROLE_FAIL);
  });
});

describe('POST /api/v1/user/remove_teacher', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'admin@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a success message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/remove_teacher',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        id: 103,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject(ALTER_ROLE_SUCCESS);
  });

  it('should return an error', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/remove_teacher',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        id: 103,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(404);
    expect(payload.errors[0]).toMatchObject(USER_ROLE_NOT_FOUND);
  });
});
