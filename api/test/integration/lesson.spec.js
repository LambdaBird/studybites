import build from '../../src/app';
import { ENROLL_SUCCESS } from '../../src/services/lesson/constants';

import { authorizeUser } from './utils';

describe('GET /api/v1/lesson', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'john@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return public lessons with the total count', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('data');
  });

  it('should return no lessons', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson?search=nomatchstring',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('data');
    expect(payload.total).toBe(0);
  });
});

describe('GET /api/v1/lesson/:lesson_id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'john@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a lesson with blocks and authors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/100',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload).toHaveProperty('isFinal');
    expect(payload.lesson).toHaveProperty('authors');
    expect(payload.lesson).toHaveProperty('blocks');
  });
});

describe('OPTIONS /api/v1/lesson', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return an array of possible lesson statuses', async () => {
    const response = await app.inject({
      method: 'OPTIONS',
      url: '/api/v1/lesson',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('properties');
  });
});

describe('POST /api/v1/lesson/enroll/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'john@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return status 200 and a success message', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `/api/v1/lesson/enroll/103`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toMatchObject(ENROLL_SUCCESS);
  });
});

describe('GET /api/v1/lesson/enrolled/', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'john@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return lessons with authors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/enrolled/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
    expect(payload.lessons[0]).toHaveProperty('maintainer');
  });

  it('should return no lessons', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/enrolled/?search=nomatchstring',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
    expect(payload.total).toBe(0);
    expect(payload.lessons.length).toBe(0);
  });
});

describe('GET /api/v1/lesson/enrolled/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await authorizeUser({
      credentials,
      app,
      setToken: (accessToken) => {
        token = accessToken;
      },
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return students with total count', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/enrolled/100',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('data');
    expect(payload.total).toBe(2);
    expect(payload.data.length).toBe(2);
  });

  it('should return no students', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/enrolled/1?search=nomatch',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('data');
    expect(payload.total).toBe(0);
    expect(payload.data.length).toBe(0);
  });
});
