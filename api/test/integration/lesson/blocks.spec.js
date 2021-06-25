import build from '../../../src/app';

describe('Test blocks routes:', () => {
  let app;

  const teachersCredentials = {
    email: 'teacher@test.io',
    password: 'passwd3',
  };

  const teachersTokens = {
    access: null,
    refresh: null,
    malformed: 'malformedtoken',
  };

  beforeAll(async () => {
    app = build();

    await app.ready();

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: teachersCredentials,
    });

    const data = JSON.parse(response.payload);

    teachersTokens.access = data.accessToken;
    teachersTokens.refresh = data.refreshToken;
  });

  afterAll(async () => {
    await app.close();
  });

  const lessonWithoutBlocks = {
    lesson: {
      name: 'New Lesson without blocks',
    },
  };

  const lessonWithBlocks = {
    lesson: {
      name: 'New Lesson with blocks',
    },
    blocks: [
      {
        revision: 'revisionHashForBlock_1',
      },
      {
        revision: 'revisionHashForBlock_2',
      },
    ],
  };

  const lessonWithUpdatedBlocks = {
    blocks: [
      {
        revision: 'revisionHashForBlock_3',
      },
      {
        revision: 'revisionHashForBlock_4',
      },
    ],
  };

  it('should return 200 for a valid lesson data without blocks', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/maintain/',
      headers: {
        Authorization: `Bearer ${teachersTokens.access}`,
      },
      payload: lessonWithoutBlocks,
    });

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.payload)).toHaveProperty('lesson');
  });

  it('should return 200 and blocks in the right order for a valid lesson data with blocks', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/maintain/',
      headers: {
        Authorization: `Bearer ${teachersTokens.access}`,
      },
      payload: lessonWithBlocks,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');

    payload.lesson.blocks.forEach((block, index) => {
      expect(block.revision).toBe(lessonWithBlocks.blocks[index].revision);
    });
  });

  it('should return 200 and blocks in the right order for a valid lesson data with blocks', async () => {
    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/lesson/maintain/1',
      headers: {
        Authorization: `Bearer ${teachersTokens.access}`,
      },
      payload: lessonWithUpdatedBlocks,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');

    payload.lesson.blocks.forEach((block, index) => {
      expect(block.revision).toBe(
        lessonWithUpdatedBlocks.blocks[index].revision,
      );
    });
  });
});
