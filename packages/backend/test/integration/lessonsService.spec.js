import build from '../../src/app';

import {
  lessonServiceErrors as errors,
  lessonServiceMessages as messages,
} from '../../src/config';

import { french } from '../../seeds/testData/lessons';
import {
  teacherMike,
  studentJohn,
  defaultPassword,
} from '../../seeds/testData/users';

import { authorizeUser, createLesson, prepareLessonFromSeed } from './utils';

describe('Enroll to lesson flow', () => {
  const testContext = {};

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
      credentials: studentCredentials,
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
        url: `/api/v1/lessons/${url}`,
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

  describe('Enroll to public', () => {
    let publicLesson;

    beforeAll(async () => {
      publicLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-publicLesson'),
      });
    });

    it('should successfully enroll', async () => {
      const response = await testContext.request({
        url: `${publicLesson.lesson.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload.message).toBe(messages.LESSON_MSG_SUCCESS_ENROLL);
    });
  });

  describe('Enroll multiple times', () => {
    let lessonToEnroll;

    beforeAll(async () => {
      lessonToEnroll = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToEnroll'),
      });

      await testContext.request({
        url: `${lessonToEnroll.lesson.id}/enroll`,
      });
    });

    it('should return an error if try to enroll multiple times', async () => {
      const response = await testContext.request({
        url: `${lessonToEnroll.lesson.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });
  });

  describe('Enroll to not public', () => {
    let draftLesson;
    let archivedLesson;
    let privateLesson;

    beforeAll(async () => {
      draftLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          lesson: {
            name: 'Draft',
            status: 'Draft',
          },
        },
      });

      archivedLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          lesson: {
            name: 'Archived',
            status: 'Archived',
          },
        },
      });

      privateLesson = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: {
          lesson: {
            name: 'Private',
            status: 'Private',
          },
        },
      });
    });

    it('should return an error if try to enroll to draft', async () => {
      const response = await testContext.request({
        url: `${draftLesson.lesson.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });

    it('should return an error if try to enroll to archived', async () => {
      const response = await testContext.request({
        url: `${archivedLesson.lesson.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });

    it('should return an error if try to enroll to private', async () => {
      const response = await testContext.request({
        url: `${privateLesson.lesson.id}/enroll`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });
  });

  describe('Get public lessons', () => {
    it('should return lessons with author', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: '',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.lessons[0]).toHaveProperty('author');
      expect(payload.lessons[0].author).toBeInstanceOf(Object);
      expect(payload.lessons[0].author).toHaveProperty('id');
      expect(payload.lessons[0].author).toHaveProperty('firstName');
      expect(payload.lessons[0].author).toHaveProperty('lastName');
    });
  });

  describe('Search through public lessons', () => {
    let lessonToSearch;

    beforeAll(async () => {
      lessonToSearch = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-uniquePublicIdentifier'),
      });

      await testContext.request({
        url: `${lessonToSearch.lesson.id}/enroll`,
      });
    });

    it('should return one lesson', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `?search=${lessonToSearch.lesson.name}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(1);
    });

    it('should return no lessons', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: '?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(0);
    });
  });
});
