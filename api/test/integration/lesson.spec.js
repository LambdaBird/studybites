import build from '../../src/app';

describe('GET /api/v1/lesson', () => {
  const app = build();

  const credentials = {
    email: 'student@test.io',
    password: 'passwd3',
  };

  const tokens = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
    await app.ready();

    const signinResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(signinResponse.payload);

    tokens.access = data.accessToken;
    tokens.refresh = data.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return public lessons with the total count', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
  });

  it('should return public lessons matching the search query', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson?search=public',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
    expect(payload.lessons.length).toBe(1);
  });

  it('should return no lessons', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson?search=nomatch',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
    expect(payload.lessons.length).toBe(0);
  });
});

describe('GET /api/v1/lesson/:lesson_id', () => {
  const app = build();

  const credentials = {
    email: 'student@test.io',
    password: 'passwd3',
  };

  const tokens = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
    await app.ready();

    const signinResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(signinResponse.payload);

    tokens.access = data.accessToken;
    tokens.refresh = data.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a lesson with blocks and authors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/1',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('authors');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload).toHaveProperty('isFinal');
  });

  it('should return a lesson without blocks', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/5',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('authors');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(0);
    expect(payload).toHaveProperty('isFinal');
  });
});

describe('POST /api/v1/lesson/maintain/', () => {
  const app = build();

  const credentials = {
    email: 'teacher@test.io',
    password: 'passwd3',
  };

  const tokens = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
    await app.ready();

    const signinResponse = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(signinResponse.payload);

    tokens.access = data.accessToken;
    tokens.refresh = data.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  it('should return a lessons without blocks', async () => {
    const body = {
      lesson: {
        name: 'New lesson',
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/maintain/',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(0);
  });

  it('should return a lesson with blocks in the right order', async () => {
    const body = {
      lesson: {
        name: 'New lesson',
      },
      blocks: [
        {
          revision: 'revisionhash_1',
        },
        {
          revision: 'revisionhash_2',
        },
        {
          revision: 'revisionhash_3',
        },
      ],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/maintain/',
      headers: {
        Authorization: `Bearer ${tokens.access}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    payload.lesson.blocks.forEach((block, index) => {
      expect(block.revision).toBe(body.blocks[index].revision);
    });
  });
});
