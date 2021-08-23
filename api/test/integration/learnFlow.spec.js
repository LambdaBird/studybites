/* eslint-disable no-underscore-dangle */
import build from '../../src/app';

import {
  studentJohn,
  teacherMike,
  defaultPassword,
} from '../../seeds/testData/users';
import { math, french, russian } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';

import {
  lessonServiceErrors as errors,
  userServiceErrors as userErrors,
} from '../../src/config';

describe('Learning flow', () => {
  const testContext = {
    app: null,
    teacherToken: null,
    studentToken: null,
    teacherRequest: async () => {},
    studentRequest: async () => {},
  };

  const teacherCredentials = {
    email: teacherMike.email,
    password: defaultPassword,
  };
  const studentCredentials = {
    email: studentJohn.email,
    password: defaultPassword,
  };

  beforeAll(async () => {
    testContext.app = build();

    await authorizeUser({
      credentials: teacherCredentials,
      app: testContext.app,
      setToken: (token) => {
        testContext.teacherToken = token;
      },
    });
    await authorizeUser({
      credentials: studentCredentials,
      app: testContext.app,
      setToken: (token) => {
        testContext.studentToken = token;
      },
    });

    testContext.teacherRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/lesson/${url}`,
        headers: {
          authorization: `Bearer ${testContext.teacherToken}`,
        },
        body,
      });
    };
    testContext.studentRequest = async ({ url, method = 'POST', body }) => {
      return testContext.app.inject({
        method,
        url: `/api/v1/lesson/${url}`,
        headers: {
          authorization: `Bearer ${testContext.studentToken}`,
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

      await testContext.studentRequest({
        url: `enroll/${notStartedLesson.lesson.id}`,
      });
    });

    it('should return error for not enrolled user', async () => {
      const response = await testContext.studentRequest({
        url: `${notEnrolledLesson.lesson.id}`,
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
      const response = await testContext.studentRequest({
        url: `${notStartedLesson.lesson.id}`,
        method: 'GET',
      });

      expect(response.statusCode).toBe(200);
      expect(response).toHaveProperty('payload');

      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lesson');
      expect(payload).toHaveProperty('isFinal');
      expect(payload.lesson).toHaveProperty('author');
      expect(payload.lesson.author).toBeInstanceOf(Object);
      expect(payload.lesson.author).toHaveProperty('id');
      expect(payload.lesson.author).toHaveProperty('firstName');
      expect(payload.lesson.author).toHaveProperty('lastName');
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

      await testContext.studentRequest({
        url: `enroll/${notStartedLesson.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${notStartedLesson.lesson.id}`,
        method: 'GET',
      });

      lessonToStart = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToStart'),
      });

      await testContext.studentRequest({
        url: `enroll/${lessonToStart.lesson.id}`,
      });
    });

    it('get request should not change state of enrolled lesson', async () => {
      const response = await testContext.studentRequest({
        url: `${notStartedLesson.lesson.id}`,
        method: 'GET',
      });

      expect(response.statusCode).toBe(200);
      expect(response).toHaveProperty('payload');

      const payload = JSON.parse(response.payload);
      expect(payload.lesson).toHaveProperty('blocks');
      expect(payload.lesson.blocks).toBeInstanceOf(Array);
      expect(payload.lesson.blocks.length).toBe(0);
      expect(payload.lesson).toHaveProperty('interactiveTotal');
      expect(payload.lesson).toHaveProperty('interactivePassed');
      expect(payload.lesson.interactiveTotal).toBe(
        math._blocks._current.length,
      );
      expect(payload.lesson.interactivePassed).toBe(0);
    });

    it('should return blocks on start', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToStart.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      expect(response.statusCode).toBe(200);

      const payload = JSON.parse(response.payload);
      expect(payload).toHaveProperty('blocks');
      expect(payload.blocks.length).toBe(
        french._blocks._indexesOfInteractive[0] + 1,
      );
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

      await testContext.studentRequest({
        url: `enroll/${notFinishedLesson.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${notFinishedLesson.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });
    });

    it('should return an error if learn flow was not finished yet', async () => {
      const response = await testContext.studentRequest({
        url: `${notFinishedLesson.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_LEARN);
    });
  });

  describe('Send the "next" action', () => {
    let lessonToNext;

    beforeAll(async () => {
      lessonToNext = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french),
      });

      await testContext.studentRequest({
        url: `enroll/${lessonToNext.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${lessonToNext.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });
    });

    it('should return a lesson with a chunk of blocks to the "next"', async () => {
      const { statusCode, payload } = await testContext.studentRequest({
        method: 'GET',
        url: `${lessonToNext.lesson.id}`,
      });

      const responseBody = JSON.parse(payload);

      expect(statusCode).toBe(200);

      expect(responseBody).toHaveProperty('total');
      expect(responseBody.total).toBe(
        french._blocks._indexesOfInteractive.length,
      );

      expect(responseBody).toHaveProperty('lesson');
      expect(responseBody.lesson).toHaveProperty('blocks');
      expect(responseBody.lesson).toHaveProperty('author');
      expect(responseBody.lesson.author).toBeInstanceOf(Object);
      expect(responseBody.lesson.author).toHaveProperty('id');
      expect(responseBody.lesson.author).toHaveProperty('firstName');
      expect(responseBody.lesson.author).toHaveProperty('lastName');

      expect(responseBody).toHaveProperty('isFinal');
      expect(responseBody.isFinal).toBe(false);

      expect(responseBody.lesson.blocks).toBeInstanceOf(Array);
      expect(responseBody.lesson.blocks).toHaveLength(
        french._blocks._indexesOfInteractive[0] + 1,
      );
      responseBody.lesson.blocks.forEach((block, index) => {
        expect(block.blockId).toBe(lessonToNext.lesson.blocks[index].blockId);
      });
    });

    it('should return a lesson with blocks to the next interactive block', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToNext.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId:
            lessonToNext.lesson.blocks[french._blocks._indexesOfInteractive[0]]
              .blockId,
          revision:
            lessonToNext.lesson.blocks[french._blocks._indexesOfInteractive[0]]
              .revision,
          reply: {
            isSolved: true,
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('isFinal');
      expect(payload).toHaveProperty('blocks');
      expect(payload.blocks).toBeInstanceOf(Array);
      expect(payload.blocks.length).toBe(
        french._blocks._indexesOfInteractive[1] -
          french._blocks._indexesOfInteractive[0],
      );
      expect(payload.blocks[1].type).toBe('quiz');
    });

    it('should return a lesson with a chunk of blocks the "next" to the "quiz" block', async () => {
      const { statusCode, payload } = await testContext.studentRequest({
        method: 'GET',
        url: `${lessonToNext.lesson.id}`,
      });

      const responseBody = JSON.parse(payload);

      expect(statusCode).toBe(200);

      expect(responseBody).toHaveProperty('total');
      expect(responseBody.total).toBe(
        french._blocks._indexesOfInteractive.length,
      );

      expect(responseBody).toHaveProperty('lesson');
      expect(responseBody.lesson).toHaveProperty('blocks');
      expect(responseBody.lesson).toHaveProperty('author');
      expect(responseBody.lesson.author).toBeInstanceOf(Object);
      expect(responseBody.lesson.author).toHaveProperty('id');
      expect(responseBody.lesson.author).toHaveProperty('firstName');
      expect(responseBody.lesson.author).toHaveProperty('lastName');

      expect(responseBody).toHaveProperty('isFinal');
      expect(responseBody.isFinal).toBe(false);

      expect(responseBody.lesson.blocks).toBeInstanceOf(Array);
      expect(responseBody.lesson.blocks).toHaveLength(
        french._blocks._indexesOfInteractive[1] + 1,
      );
      responseBody.lesson.blocks.forEach((block, index) => {
        expect(block.blockId).toBe(lessonToNext.lesson.blocks[index].blockId);
      });
    });

    it('should not be able to finish this lesson yet', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToNext.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_LEARN);
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

      await testContext.studentRequest({
        url: `enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].revision,
          reply: {
            isSolved: true,
          },
        },
      });
    });

    it('should return a lesson with blocks to the next interactive block, and answer', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].revision,
          reply: {
            response: [true, false, false],
          },
        },
      });
      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('isFinal');
      expect(payload).toHaveProperty('blocks');
      expect(payload).toHaveProperty('answer');
      expect(payload).toHaveProperty('reply');
      expect(payload.blocks).toBeInstanceOf(Array);
      expect(payload.blocks.length).toBe(1);
      expect(payload.isFinal).toBe(true);
    });

    it('should return a lesson with a chunk of blocks from the "quiz" to the last block', async () => {
      const { statusCode, payload } = await testContext.studentRequest({
        method: 'GET',
        url: `${lessonToAnswer.lesson.id}`,
      });

      const responseBody = JSON.parse(payload);

      expect(statusCode).toBe(200);

      expect(responseBody).toHaveProperty('total');
      expect(responseBody.total).toBe(
        french._blocks._indexesOfInteractive.length,
      );

      expect(responseBody).toHaveProperty('lesson');
      expect(responseBody.lesson).toHaveProperty('blocks');
      expect(responseBody.lesson).toHaveProperty('author');
      expect(responseBody.lesson).toHaveProperty('interactiveTotal');
      expect(responseBody.lesson).toHaveProperty('interactivePassed');
      expect(responseBody.lesson.author).toBeInstanceOf(Object);
      expect(responseBody.lesson.author).toHaveProperty('id');
      expect(responseBody.lesson.author).toHaveProperty('firstName');
      expect(responseBody.lesson.author).toHaveProperty('lastName');

      expect(responseBody.lesson.interactiveTotal).toBe(
        french._blocks._indexesOfInteractive.length,
      );
      expect(responseBody.lesson.interactivePassed).toBe(
        french._blocks._indexesOfInteractive.length,
      );

      expect(responseBody).toHaveProperty('isFinal');
      expect(responseBody.isFinal).toBe(true);

      expect(responseBody.lesson.blocks).toBeInstanceOf(Array);
      expect(responseBody.lesson.blocks).toHaveLength(
        french._blocks._current.length,
      );
      responseBody.lesson.blocks.forEach((block, index) => {
        expect(block.blockId).toBe(lessonToAnswer.lesson.blocks[index].blockId);
      });
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

      await testContext.studentRequest({
        url: `enroll/${lessonToFinish.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.studentRequest({
        url: `${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId:
            lessonToFinish.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].blockId,
          revision:
            lessonToFinish.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].revision,
          reply: {
            isSolved: true,
          },
        },
      });

      await testContext.studentRequest({
        url: `${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId:
            lessonToFinish.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].blockId,
          revision:
            lessonToFinish.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].revision,
          reply: {
            response: [true, false, false],
          },
        },
      });
    });

    it('should finish and return no blocks', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToFinish.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('blocks');
      expect(payload.blocks).toBeInstanceOf(Array);
      expect(payload.blocks.length).toBe(0);
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

      await testContext.studentRequest({
        url: `enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });
    });

    it('should return an error', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].revision,
          reply: {
            response: [true, false, false],
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_LEARN);
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

      await testContext.studentRequest({
        url: `enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].revision,
          reply: {
            isSolved: true,
          },
        },
      });

      await testContext.teacherRequest({
        method: 'PUT',
        url: `maintain/${lessonToAnswer.lesson.id}`,
        body: {
          lesson: {
            status: 'Archived',
          },
        },
      });
    });

    it('should return an error', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].revision,
          reply: {
            response: [true, false, false],
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(401);
      expect(payload.statusCode).toBe(401);
      expect(payload.message).toBe(userErrors.USER_ERR_UNAUTHORIZED);
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

      await testContext.studentRequest({
        url: `enroll/${lessonToAnswer.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].revision,
          reply: {
            isSolved: true,
          },
        },
      });

      await testContext.teacherRequest({
        method: 'PUT',
        url: `maintain/${lessonToAnswer.lesson.id}`,
        body: {
          lesson: {
            status: 'Draft',
          },
        },
      });
    });

    it('should return no error', async () => {
      const response = await testContext.studentRequest({
        url: `${lessonToAnswer.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].blockId,
          revision:
            lessonToAnswer.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].revision,
          reply: {
            response: [true, false, false],
          },
        },
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('isFinal');
      expect(payload).toHaveProperty('blocks');
      expect(payload).toHaveProperty('answer');
      expect(payload).toHaveProperty('reply');
      expect(payload.blocks).toBeInstanceOf(Array);
      expect(payload.blocks.length).toBe(1);
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

      await testContext.studentRequest({
        url: `enroll/${finishedLesson.lesson.id}`,
      });

      await testContext.studentRequest({
        url: `${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'start',
        },
      });

      await testContext.studentRequest({
        url: `${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'next',
          blockId:
            finishedLesson.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].blockId,
          revision:
            finishedLesson.lesson.blocks[
              french._blocks._indexesOfInteractive[0]
            ].revision,
          reply: {
            isSolved: true,
          },
        },
      });

      await testContext.studentRequest({
        url: `${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'response',
          blockId:
            finishedLesson.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].blockId,
          revision:
            finishedLesson.lesson.blocks[
              french._blocks._indexesOfInteractive[1]
            ].revision,
          reply: {
            response: [true, false, false],
          },
        },
      });

      await testContext.studentRequest({
        url: `${finishedLesson.lesson.id}/learn`,
        body: {
          action: 'finish',
        },
      });
    });

    it('should return all finished lessons with their author', async () => {
      const response = await testContext.studentRequest({
        url: `enrolled-finished/`,
        method: 'GET',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.lessons).toBeInstanceOf(Array);
      expect(payload.lessons[0]).toHaveProperty('author');
      expect(payload.lessons[0].author).toBeInstanceOf(Object);
      expect(payload.lessons[0].author).toHaveProperty('id');
      expect(payload.lessons[0].author).toHaveProperty('firstName');
      expect(payload.lessons[0].author).toHaveProperty('lastName');
    });
  });

  describe('Learn lesson with one block (interactive)', () => {
    describe('start lesson', () => {
      let notStarted;

      beforeAll(async () => {
        notStarted = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(math),
        });

        await testContext.studentRequest({
          url: `enroll/${notStarted.lesson.id}`,
        });
      });

      it('should return one block', async () => {
        const response = await testContext.studentRequest({
          url: `${notStarted.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);

        expect(payload).toHaveProperty('blocks');
        expect(payload.blocks.length).toBe(1);

        expect(payload).toHaveProperty('total');
        expect(payload.total).toBe(1);

        expect(payload).toHaveProperty('isFinal');
        expect(payload.isFinal).toBe(false);
      });
    });

    describe('answer to interactive', () => {
      let notAnswered;

      beforeAll(async () => {
        notAnswered = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(math),
        });

        await testContext.studentRequest({
          url: `enroll/${notAnswered.lesson.id}`,
        });

        await testContext.studentRequest({
          url: `${notAnswered.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });
      });

      it('should return answer and reply', async () => {
        const response = await testContext.studentRequest({
          url: `${notAnswered.lesson.id}/learn`,
          body: {
            action: 'response',
            blockId: notAnswered.lesson.blocks[0].blockId,
            revision: notAnswered.lesson.blocks[0].revision,
            reply: {
              response: [true, false, false],
            },
          },
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);

        expect(payload).toHaveProperty('blocks');
        expect(payload.blocks.length).toBe(0);

        expect(payload).toHaveProperty('total');
        expect(payload.total).toBe(1);

        expect(payload).toHaveProperty('isFinal');
        expect(payload.isFinal).toBe(true);

        expect(payload).toHaveProperty('answer');
        expect(payload).toHaveProperty('reply');
      });
    });

    describe('finish the lesson', () => {
      let notFinished;

      beforeAll(async () => {
        notFinished = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(math),
        });

        await testContext.studentRequest({
          url: `enroll/${notFinished.lesson.id}`,
        });

        await testContext.studentRequest({
          url: `${notFinished.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });

        await testContext.studentRequest({
          url: `${notFinished.lesson.id}/learn`,
          body: {
            action: 'response',
            blockId: notFinished.lesson.blocks[0].blockId,
            revision: notFinished.lesson.blocks[0].revision,
            reply: {
              response: [true, false, false],
            },
          },
        });
      });

      it('should return no blocks on finish', async () => {
        const response = await testContext.studentRequest({
          url: `${notFinished.lesson.id}/learn`,
          body: {
            action: 'finish',
          },
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);

        expect(payload).toHaveProperty('blocks');
        expect(payload.blocks.length).toBe(0);

        expect(payload).toHaveProperty('total');
        expect(payload.total).toBe(math._blocks._current.length);

        expect(payload).toHaveProperty('isFinished');
        expect(payload.isFinished).toBe(true);
      });
    });
  });

  describe('Learn lesson with one block (non-interactive)', () => {
    describe('start lesson', () => {
      let notStarted;

      beforeAll(async () => {
        notStarted = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(russian),
        });

        await testContext.studentRequest({
          url: `enroll/${notStarted.lesson.id}`,
        });
      });

      it('should return one block', async () => {
        const response = await testContext.studentRequest({
          url: `${notStarted.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);

        expect(payload).toHaveProperty('blocks');
        expect(payload.blocks.length).toBe(1);

        expect(payload).toHaveProperty('total');
        expect(payload.total).toBe(1);

        expect(payload).toHaveProperty('isFinal');
        expect(payload.isFinal).toBe(true);
      });
    });

    describe('finish the lesson', () => {
      let notFinished;

      beforeAll(async () => {
        notFinished = await createLesson({
          app: testContext.app,
          credentials: teacherCredentials,
          body: prepareLessonFromSeed(russian),
        });

        await testContext.studentRequest({
          url: `enroll/${notFinished.lesson.id}`,
        });

        await testContext.studentRequest({
          url: `${notFinished.lesson.id}/learn`,
          body: {
            action: 'start',
          },
        });
      });

      it('should return no blocks on finish', async () => {
        const response = await testContext.studentRequest({
          url: `${notFinished.lesson.id}/learn`,
          body: {
            action: 'finish',
          },
        });

        const payload = JSON.parse(response.payload);

        expect(response.statusCode).toBe(200);

        expect(payload).toHaveProperty('blocks');
        expect(payload.blocks.length).toBe(0);

        expect(payload).toHaveProperty('total');
        expect(payload.total).toBe(russian._blocks._current.length);

        expect(payload).toHaveProperty('isFinished');
        expect(payload.isFinished).toBe(true);
      });
    });
  });
});
