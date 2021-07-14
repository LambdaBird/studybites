import build from '../../src/app';

import {
  studentJohn,
  teacherMike,
  defaultPassword,
} from '../../seeds/testData/users';
import { math, french } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';
import {
  INVALID_LEARN,
  NOT_FINISHED,
} from '../../src/services/lesson/constants';
import { UNAUTHORIZED } from '../../src/services/user/constants';

// eslint-disable-next-line no-underscore-dangle
const blocks = french._blocks._current;
// eslint-disable-next-line no-underscore-dangle
const indexesOfInteractive = french._blocks._indexesOfInteractive;

describe('Learning flow', () => {
  const testContext = {};
  const teacherCredentials = {
    email: teacherMike.email,
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

    await authorizeUser({
      credentials: teacherCredentials,
      app: testContext.app,
      setToken: (accessToken) => {
        testContext.teacherToken = accessToken;
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

    testContext.teacherRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/${url}`,
        headers: {
          Authorization: `Bearer ${testContext.teacherToken}`,
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
  });

  describe('Finish the unfinished lesson', () => {
    let notFinishedLesson;

    beforeAll(async () => {
      notFinishedLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-notFinishedLesson'),
      });

      await testContext.request({
        url: `lesson/enroll/${notFinishedLesson.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${notFinishedLesson.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });
    });

    it('should return an error if learn flow was not finished yet', async () => {
      const response = await testContext.request({
        url: `lesson/${notFinishedLesson.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.errors[0]).toMatchObject(NOT_FINISHED);
    });
  });

  describe('Send the "next" action', () => {
    let lessonToNext;

    beforeAll(async () => {
      lessonToNext = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToNext'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToNext.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToNext.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });
    });

    it('should return a lesson with blocks to the next interactive block', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToNext.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            lessonToNext.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload).toHaveProperty('isFinal');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(
        indexesOfInteractive[1] - indexesOfInteractive[0],
      );
      expect(payload.lesson.blocks[1].type).toBe('quiz');
    });

    it('should not be able to finish this lesson yet', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToNext.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.errors[0]).toMatchObject(NOT_FINISHED);
    });
  });

  describe('Answer to quiz', () => {
    let lessonToAnswer;

    beforeAll(async () => {
      lessonToAnswer = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToAnswer'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });
    });

    it('should return a lesson with blocks to the next interactive block, and answer', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[1]].revision,
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
  });

  describe('Finish the lesson', () => {
    let lessonToFinish;

    beforeAll(async () => {
      lessonToFinish = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToFinish'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToFinish.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.request({
        url: `lesson/${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            lessonToFinish.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });

      await testContext.request({
        url: `lesson/${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            lessonToFinish.lesson.blocks[indexesOfInteractive[1]].revision,
          data: {
            answers: ['my answer'],
          },
        },
      });
    });

    it('should finish and return all blocks', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToFinish.lesson.id}/learn`,
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

  describe('Resume the lesson', () => {
    let lessonToResume;

    beforeAll(async () => {
      lessonToResume = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToResume'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToResume.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToResume.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.request({
        url: `lesson/${lessonToResume.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            lessonToResume.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });
    });

    it('should return a lesson with blocks to the next interactive block', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToResume.lesson.id}/learn`,
        body: {
          action: 'resume',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            lessonToResume.lesson.blocks[indexesOfInteractive[1]].revision,
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload).toHaveProperty('isFinal');
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(
        indexesOfInteractive[1] - indexesOfInteractive[0],
      );
      expect(payload.lesson.blocks[1].type).toBe('quiz');
    });
  });

  describe('Answer to the quiz before the "next" block', () => {
    let lessonToAnswer;

    beforeAll(async () => {
      lessonToAnswer = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToAnswerBeforeNext'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });
    });

    it('should return an error', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[1]].revision,
          data: {
            answers: ['my answer'],
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.errors[0]).toMatchObject(INVALID_LEARN);
    });
  });

  describe('Answer to the quiz for the "Archived" lesson', () => {
    let lessonToAnswer;

    beforeAll(async () => {
      lessonToAnswer = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToAnswerArchived'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });

      await testContext.teacherRequest({
        method: 'PUT',
        url: `lesson/maintain/${lessonToAnswer.lesson.id}`,
        body: {
          lesson: {
            status: 'Archived',
          },
        },
      });
    });

    it('should return an error', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[1]].revision,
          data: {
            answers: ['my answer'],
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.errors[0]).toMatchObject(UNAUTHORIZED);
    });
  });

  describe('Answer to the quiz for the "Draft" lesson', () => {
    let lessonToAnswer;

    beforeAll(async () => {
      lessonToAnswer = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToAnswerDraft'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });

      await testContext.teacherRequest({
        method: 'PUT',
        url: `lesson/maintain/${lessonToAnswer.lesson.id}`,
        body: {
          lesson: {
            status: 'Draft',
          },
        },
      });
    });

    it('should return no error', async () => {
      const response = await testContext.request({
        url: `lesson/${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            lessonToAnswer.lesson.blocks[indexesOfInteractive[1]].revision,
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
  });

  describe('Get all finished lessons', () => {
    let finishedLesson;

    beforeAll(async () => {
      finishedLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-finishedLesson'),
      });

      await testContext.request({
        url: `lesson/enroll/${finishedLesson.lesson.id}`,
      });

      await testContext.request({
        url: `lesson/${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.request({
        url: `lesson/${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId: blocks[indexesOfInteractive[0]].block_id,
          revision:
            finishedLesson.lesson.blocks[indexesOfInteractive[0]].revision,
        },
      });

      await testContext.request({
        url: `lesson/${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId: blocks[indexesOfInteractive[1]].block_id,
          revision:
            finishedLesson.lesson.blocks[indexesOfInteractive[1]].revision,
          data: {
            answers: ['my answer'],
          },
        },
      });

      await testContext.request({
        url: `lesson/${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });
    });

    it('should return all finished lessons with their maintainers', async () => {
      const response = await testContext.request({
        url: `lesson/enrolled-finished/`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.lessons).toBeInstanceOf(Array);
      expect(payload.lessons[0]).toHaveProperty('maintainer');
    });
  });
});
