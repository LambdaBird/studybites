import build from '../../src/app';

import { studentJohn, teacher, defaultPassword } from '../../seeds/testData/users';
import { math, french } from '../../seeds/testData/lessons';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';

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
      return await testContext.app.inject({
        method: method,
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
      await testContext.request({ url: `lesson/enroll/${notStartedLesson.lesson.id}` });
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

    it('get request should not change state of enorlled lesson', async () => {
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
      expect(payload.lesson).toHaveProperty('blocks');;
      expect(payload.lesson.blocks.length).toBe(
        french._blocks._indexesOfInteractive[0] + 1,
      );
    });
  });
});
