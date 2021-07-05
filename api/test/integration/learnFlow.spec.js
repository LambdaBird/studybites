import build from '../../src/app';

import {
  studentJohn,
  teacher,
  defaultPassword,
} from '../../seeds/testData/users';
import { math, french } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';
import { NOT_FINISHED } from '../../src/services/lesson/constants';

// eslint-disable-next-line no-underscore-dangle
const blocks = french._blocks._current;
// eslint-disable-next-line no-underscore-dangle
const indexesOfInteractive = french._blocks._indexesOfInteractive;

describe('Learning flow', () => {
  const testContext = {};
  const teacherCredentials = {
    email: teacher.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();

    await authorizeUser({
      credentials: {
        email: studentJohn.email,
        password: defaultPassword,
      },
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.token = accessToken;
      },
    });

    testContext.request = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.token}`,
        },
        body,
      });
    };
  });

  afterAll(async () => {
    await testContext.app.close();
  });

  describe('Get untaken lesson by student', () => {
    let notEnrolledLesson;
    let notStartedLesson;

    beforeAll(async () => {
      notEnrolledLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math, '-notEnrolledLesson'),
      });

      notStartedLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math, '-notStartedLesson'),
      });
      await testContext.request({
        url: `lesson/enroll/${notStartedLesson.lesson.id}`,
      });
    });

    it('should return error for not enrolled user', async () => {
      const response = await testContext.request({
        url: `lesson/${notEnrolledLesson.lesson.id}`,
        method: 'GET',
      });

      expect(response.statusCode).toBe(401);
      expect(response).toHaveProperty('payload');
      const payload = JSON.parse(response.payload);
      expect(payload).not.toHaveProperty('total');
      expect(payload).not.toHaveProperty('lesson');
      expect(payload).not.toHaveProperty('isFinal');
    });

    it('should return no blocks for not started lesson', async () => {
      const response = await testContext.request({
        url: `lesson/${notStartedLesson.lesson.id}`,
        method: 'GET',
      });

      expect(response.statusCode).toBe(200);
      expect(response).toHaveProperty('payload');

      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload).toHaveProperty('isFinal');
      expect(payload.lesson).toHaveProperty('authors');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(0);
    });
  });

  describe('Get enrolled lesson by student', () => {
    let notStartedLesson;
    let lessonToStart;

    beforeAll(async () => {
      notStartedLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(math, '-notStartedLesson'),
      });

      await testContext.request({
        url: `lesson/enroll/${notStartedLesson.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${notStartedLesson.lesson.id}`,
        method: 'GET',
      });

      lessonToStart = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToStart'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToStart.lesson.id}`,
      });
    });

    it('get request should not change state of enrolled lesson', async () => {
      const response = await testContext.request({
        url: `lesson/${notStartedLesson.lesson.id}`,
        method: 'GET',
      });

      expect(response.statusCode).toBe(200);
      expect(response).toHaveProperty('payload');

      const payload = JSON.parse(response.payload);
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(0);
    });

    it('should return blocks on start', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToStart.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      expect(response.statusCode).toBe(200);

      const payload = JSON.parse(response.payload);
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks.length).toBe(indexesOfInteractive[0] + 1);
    });

    it('should return an error if learn flow was not finished yet', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToStart.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.errors[0]).toMatchObject(NOT_FINISHED);
    });

    it('should return a lesson with blocks to the next interactive block', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToStart.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision: lessonToStart.lesson.blocks.find(
            (block) =>
              block.block_id === blocks[indexesOfInteractive[0]].block_id,
          ).revision,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload).toHaveProperty('isFinal');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(2);
      expect(payload.lesson.blocks[1].type).toBe('quiz');
    });

    it('should return a lesson with blocks to the next interactive block, and answer', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToStart.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision: lessonToStart.lesson.blocks.find(
            (block) =>
              block.block_id === blocks[indexesOfInteractive[1]].block_id,
          ).revision,
          data: {
            answers: ['my answer'],
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload).toHaveProperty('isFinal');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson).toHaveProperty('answer');
      expect(payload.lesson).toHaveProperty('userAnswer');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(1);
      expect(payload.isFinal).toBe(true);
    });

    it('should return a lesson with all blocks', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToStart.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(6);
    });
  });
});
