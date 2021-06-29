import Knex from 'knex';

import build from '../../src/app';
import config from '../../config';

const prefix = '/api/v1/lesson';

describe(`GET ${prefix}`, () => {
  const app = build();

  const knex = Knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });

  let token;

  const resources = {
    users: [
      {
        id: 1,
        email: 'teacher@test.io',
        password: '$2b$12$cCb6rfWiaeLyxNYWvDwBbe7bXXVzlPMxlV1J6cp1EjSyCRKnGC.6e',
        first_name: 'Teacher',
        last_name: 'User',
      },
      {
        id: 2,
        email: 'student@test.io',
        password: '$2b$12$cCb6rfWiaeLyxNYWvDwBbe7bXXVzlPMxlV1J6cp1EjSyCRKnGC.6e',
        first_name: 'Student',
        last_name: 'User',
      },
    ],
    lessons: [
      {
        id: 1,
        name: 'Math',
        status: 'Public',
      },
      {
        id: 2,
        name: 'English',
        status: 'Public',
      },
      {
        id: 3,
        name: 'Biology',
        status: 'Public',
      },
    ],
    usersRoles: [
      {
        user_id: 1,
        role_id: config.roles.TEACHER.id,
      },
      {
        user_id: 1,
        role_id: config.roles.MAINTAINER.id,
        resource_type: config.resources.LESSON,
        resource_id: 1,
      },
      {
        user_id: 1,
        role_id: config.roles.MAINTAINER.id,
        resource_type: config.resources.LESSON,
        resource_id: 2,
      },
      {
        user_id: 1,
        role_id: config.roles.MAINTAINER.id,
        resource_type: config.resources.LESSON,
        resource_id: 3,
      },
    ],
  };

  const credentials = {
    email: 'student@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    await knex('users').insert(resources.users);
    await knex('lessons').insert(resources.lessons);
    await knex('users_roles').insert(resources.usersRoles);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await knex('users_roles').delete();
    await knex('lessons').delete();
    await knex('users').delete();

    await app.close();
    await knex.destroy();
  });

  it('should return public lessons with the total count', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${prefix}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
    expect(payload.total).toBe(3);
    expect(payload.lessons.length).toBe(3);
  });

  it('should return public lessons matching the search query', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${prefix}?search=${resources.lessons[0].name}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('total');
    expect(payload).toHaveProperty('lessons');
    expect(payload.lessons.length).toBe(1);
    expect(payload.total).toBe(1);
    expect(payload.lessons[0].name).toBe(resources.lessons[0].name);
  });

  it('should return no lessons', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${prefix}?search=nomatch`,
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

describe(`GET ${prefix}/:lesson_id`, () => {
  const app = build();

  const knex = Knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });

  let token;

  const resources = {
    users: [
      {
        id: 1,
        email: 'teacher@test.io',
        password: '$2b$12$cCb6rfWiaeLyxNYWvDwBbe7bXXVzlPMxlV1J6cp1EjSyCRKnGC.6e',
        first_name: 'Teacher',
        last_name: 'User',
      },
      {
        id: 2,
        email: 'student@test.io',
        password: '$2b$12$cCb6rfWiaeLyxNYWvDwBbe7bXXVzlPMxlV1J6cp1EjSyCRKnGC.6e',
        first_name: 'Student',
        last_name: 'User',
      },
    ],
    lessons: [
      {
        id: 1,
        name: 'Math',
        status: 'Public',
      },
      {
        id: 2,
        name: 'English',
        status: 'Public',
      },
    ],
    blocks: [
      {
        block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55c',
        content: {
          data: 'paragraph text',
        },
        type: 'paragraph',
        revision: '9f8ef6dd-34aa-4ff4-9fc6-4b5afbfde165',
      },
      {
        block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e395',
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
        block_id: '8483d0b2-9576-4b35-957b-58b63d097f6f',
        content: {
          data: 'paragraph text',
        },
        type: 'paragraph',
        revision: '5014d8d5-d4e3-4135-995f-0e84cded4cdb',
      },
    ],
    lessonBlockStructure: [
      {
        id: 'af7d4157-d009-4260-a42f-919ee4a55a9e',
        lesson_id: 1,
        block_id: 'aa34585e-130b-468c-be1a-5a8012f0d55c',
        child_id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
      },
      {
        id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
        lesson_id: 1,
        block_id: '7142e20a-0d30-47e5-aea8-546e0ec5e395',
        child_id: '9c3f1934-328e-44e0-8cf4-c52beb30c6b5',
        parent_id: 'af7d4157-d009-4260-a42f-919ee4a55a9e',
      },
      {
        id: '9c3f1934-328e-44e0-8cf4-c52beb30c6b5',
        lesson_id: 1,
        block_id: '8483d0b2-9576-4b35-957b-58b63d097f6f',
        parent_id: '0b7e5d54-a78c-4340-abec-ee08713d43bd',
      },
    ],
    usersRoles: [
      {
        user_id: 1,
        role_id: config.roles.TEACHER.id,
      },
      {
        user_id: 1,
        role_id: config.roles.MAINTAINER.id,
        resource_type: config.resources.LESSON,
        resource_id: 1,
      },
      {
        user_id: 2,
        role_id: config.roles.STUDENT.id,
        resource_type: config.resources.LESSON,
        resource_id: 1,
      },
      {
        user_id: 1,
        role_id: config.roles.MAINTAINER.id,
        resource_type: config.resources.LESSON,
        resource_id: 2,
      },
      {
        user_id: 2,
        role_id: config.roles.STUDENT.id,
        resource_type: config.resources.LESSON,
        resource_id: 2,
      },
    ],
  };

  const credentials = {
    email: 'student@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    await knex('users').insert(resources.users);
    await knex('lessons').insert(resources.lessons);
    await knex('users_roles').insert(resources.usersRoles);
    await knex('blocks').insert(resources.blocks);
    await knex('lesson_block_structure').insert(resources.lessonBlockStructure);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await knex('lesson_block_structure').delete();
    await knex('blocks').delete();
    await knex('users_roles').delete();
    await knex('lessons').delete();
    await knex('users').delete();

    await app.close();
    await knex.destroy();
  });

  it('should return a lesson with blocks and authors', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${prefix}/1`,
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
    expect(payload.total).toBe(3);
    expect(payload.lesson.blocks.length).toBe(0);
  });

  it('should return a lesson without blocks', async () => {
    const response = await app.inject({
      method: 'GET',
      url: `${prefix}/2`,
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
    expect(payload.total).toBe(0);
    expect(payload.lesson.blocks.length).toBe(0);
  });
});

describe(`POST ${prefix}/maintain/`, () => {
  const app = build();

  const knex = Knex({
    client: 'pg',
    connection: process.env.DATABASE_URL,
  });

  let token;

  const resources = {
    users: [
      {
        id: 1,
        email: 'teacher@test.io',
        password: '$2b$12$cCb6rfWiaeLyxNYWvDwBbe7bXXVzlPMxlV1J6cp1EjSyCRKnGC.6e',
        first_name: 'Teacher',
        last_name: 'User',
      },
    ],
    lessons: [
      {
        id: 1,
        name: 'Math',
        status: 'Public',
      },
      {
        id: 2,
        name: 'English',
        status: 'Public',
      },
    ],
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
    usersRoles: [
      {
        user_id: 1,
        role_id: config.roles.TEACHER.id,
      },
    ],
  };

  const credentials = {
    email: 'teacher@test.io',
    password: 'passwd3',
  };

  beforeAll(async () => {
    await app.ready();

    await knex('users').insert(resources.users);
    await knex('users_roles').insert(resources.usersRoles);

    const response = await app.inject({
      method: 'POST',
      url: '/api/v1/user/signin',
      payload: credentials,
    });

    const data = JSON.parse(response.payload);

    token = data.accessToken;
  });

  afterAll(async () => {
    await knex('lesson_block_structure').delete();
    await knex('blocks').delete();
    await knex('users_roles').delete();
    await knex('lessons').delete();
    await knex('users').delete();

    await app.close();
    await knex.destroy();
  });

  it('should return a lessons without blocks', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `${prefix}/maintain/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        lesson: resources.lessons[0],
      }
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(0);
  });

  it('should return a lesson with blocks in the right order', async () => {
    const response = await app.inject({
      method: 'POST',
      url: `${prefix}/maintain/`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        lesson: resources.lessons[1],
        blocks: resources.blocks,
      }
    });

    const payload = JSON.parse(response.payload);

    expect(response.statusCode).toBe(200);
    expect(payload).toHaveProperty('lesson');
    expect(payload.lesson).toHaveProperty('blocks');
    expect(payload.lesson.blocks.length).toBe(3);
    payload.lesson.blocks.forEach((block, index) => {
      expect(block.revision).toBe(resources.blocks[index].revision);
    });
  });
});