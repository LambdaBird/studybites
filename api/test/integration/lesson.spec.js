import build from '../../src/app';
import {
  ENROLL_SUCCESS,
  NOT_FINISHED,
  NOT_STARTED,
} from '../../src/services/lesson/constants';

describe('GET /api/v1/lesson', () => {
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

describe('GET /api/v1/lesson/maintain/students', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
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

  it('should return students with total count', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/maintain/students',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('students');
  });

  it('should return no students', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/maintain/students?search=nomatchstring',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('students');
    expect(payload.total).toBe(0);
  });
});

describe('GET /api/v1/lesson/maintain/', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
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

  it('should return lessons with total count', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/maintain/',
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
      url: '/api/v1/lesson/maintain/?search=nomatchstring',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('data');
  });
});

describe('GET /api/v1/lesson/maintain/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
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

  it('should return a lesson with blocks', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/v1/lesson/maintain/100',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
  });
});

describe('POST /api/v1/lesson/maintain/', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
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

  it('should return a lesson without blocks', async () => {
    const body = {
      lesson: {
        name: 'Math',
        status: 'Public',
      },
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/maintain/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
  });

  it('should return a lesson with blocks', async () => {
    const body = {
      lesson: {
        name: 'English',
        status: 'Public',
      },
      blocks: [
        {
          content: {
            data: 'paragraph text',
          },
          type: 'paragraph',
          revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde165',
        },
        {
          content: {
            data: 'quiz question',
          },
          type: 'quiz',
          answer: {
            data: 1,
          },
          revision: '06421c44-a853-4708-8f40-81c55a0e8861',
        },
        {
          content: {
            data: 'paragraph text',
          },
          type: 'paragraph',
          revision: '5014d8d5-d4e3-4135-995f-0e84cded4cdb',
        },
      ],
    };

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/maintain/',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(3);
    payload.lesson.blocks.forEach((block, index) => {
      expect(block.revision).toBe(body.blocks[index].revision);
    });
  });
});

describe('PUT /api/v1/maintain/:id', () => {
  const app = build();

  let token;

  const credentials = {
    email: 'mike@test.io',
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

  it('should return a lesson with blocks', async () => {
    const body = {
      blocks: [
        {
          content: {
            data: 'quiz question',
          },
          type: 'quiz',
          answer: {
            data: 1,
          },
          revision: '06421c44-a853-4708-8f40-81c55a0e8871',
        },
        {
          content: {
            data: 'paragraph text',
          },
          type: 'paragraph',
          revision: '5014d8d5-d4e3-4135-995f-0e84cded4cab',
        },
        {
          content: {
            data: 'paragraph text',
          },
          type: 'paragraph',
          revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde175',
        },
      ],
    };

    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/lesson/maintain/100',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(3);
    payload.lesson.blocks.forEach((block, index) => {
      expect(block.revision).toBe(body.blocks[index].revision);
    });
  });

  it('should return a lesson without blocks', async () => {
    const body = {
      blocks: [],
    };

    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/lesson/maintain/100',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
  });

  it('should return a lesson without blocks and a new name', async () => {
    const body = {
      lesson: {
        name: 'The new name',
      },
      blocks: [],
    };

    const response = await app.inject({
      method: 'PUT',
      url: '/api/v1/lesson/maintain/100',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson.name).toBe(body.lesson.name);
  });
});

describe('POST /api/v1/lesson/enroll/:id', () => {
  const app = build();

  let token;
  let lessonId;

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

describe('POST /api/v1/lesson/:lesson_id/learn', () => {
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

  it('should return an error if learn flow was not started yet', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/200/learn',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: 'finish',
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(400);
    expect(payload.errors[0]).toMatchObject(NOT_STARTED);
  });

  it('should return a lesson with blocks to the next interactive block', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/200/learn',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: 'start',
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload).toHaveProperty('isFinal');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(3);
    expect(payload.lesson.blocks[2].type).toBe('next');
  });

  it('should return an error if learn flow was not finished yet', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/200/learn',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: 'finish',
      },
    });

    const payload = JSON.parse(response.payload);
    // console.log(payload)

    expect(response.statusCode).toBe(400);
    expect(payload.errors[0]).toMatchObject(NOT_FINISHED);
  });

  it('should return a lesson with blocks to the next interactive block', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/200/learn',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: 'next',
        blockId: 'aa34585e-130b-468c-be1a-5a8012f0d57a',
        revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde366',
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload).toHaveProperty('isFinal');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(2);
    expect(payload.lesson.blocks[1].type).toBe('quiz');
  });

  it('should return a lesson with blocks to the next interactive block, and answer', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/200/learn',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: 'response',
        blockId: '7142e20a-0d30-47e5-aea8-546e0ec5e396',
        revision: '06421c44-a853-4708-8f40-81c55a0e8862',
        data: {
          answers: ['my answer'],
        },
      },
    });

    const payload = JSON.parse(response.payload);
    // console.log(payload)

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload).toHaveProperty('isFinal');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson).toHaveProperty('answer');
    expect(payload.lesson).toHaveProperty('userAnswer');
    expect(payload.lesson.blocks.length).toBe(1);
    expect(payload.isFinal).toBe(true);
  });

  it('should return a lesson with all blocks', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/lesson/200/learn',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        action: 'finish',
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(6);
  });
});
