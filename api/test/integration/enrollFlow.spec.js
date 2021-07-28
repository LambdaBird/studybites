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
        url: `lesson/enroll/${publicLesson.lesson.id}`,
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
        url: `lesson/enroll/${lessonToEnroll.lesson.id}`,
      });
    });

    it('should return an error if try to enroll multiple times', async () => {
      const response = await testContext.request({
        url: `lesson/enroll/${lessonToEnroll.lesson.id}`,
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
        url: `lesson/enroll/${draftLesson.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });

    it('should return an error if try to enroll to archived', async () => {
      const response = await testContext.request({
        url: `lesson/enroll/${archivedLesson.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });

    it('should return an error if try to enroll to private', async () => {
      const response = await testContext.request({
        url: `lesson/enroll/${privateLesson.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(400);
      expect(payload.statusCode).toBe(400);
      expect(payload.message).toBe(errors.LESSON_ERR_FAIL_ENROLL);
    });
  });

  describe('Get enrolled lessons', () => {
    it('should return lessons with author', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson/enrolled/',
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

  describe('Search through enrolled lessons', () => {
    let lessonToSearch;

    beforeAll(async () => {
      lessonToSearch = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-uniqueIdentifierForStudent'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToSearch.lesson.id}`,
      });
    });

    it('should return one lesson', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/enrolled/?search=${lessonToSearch.lesson.name}`,
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
      expect(payload.total).toBe(1);
    });

    it('should return no lessons', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson/enrolled/?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(0);
    });
  });

  describe('Get public lessons', () => {
    it('should return lessons with author', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: 'lesson',
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
        body: prepareLessonFromSeed(french, '-uniquePublic'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToSearch.lesson.id}`,
      });
    });

    it('should return one lesson', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson?search=${lessonToSearch.lesson.name}`,
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
        url: 'lesson?search=nomatchstring',
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('total');
      expect(payload).toHaveProperty('lessons');
      expect(payload.total).toBe(0);
    });
  });

  describe('Get enrolled lesson by id', () => {
    let lessonToGet;

    beforeAll(async () => {
      lessonToGet = await createLesson({
        app: testContext.app,
        credentials: teacherCredentials,
        body: prepareLessonFromSeed(french, '-lessonToGet'),
      });

      await testContext.request({
        url: `lesson/enroll/${lessonToGet.lesson.id}`,
      });
    });

    it('should return a lesson object', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/enroll/${lessonToGet.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(response.statusCode).toBe(200);
      expect(payload).toHaveProperty('lesson');
      expect(payload.lesson).toBeInstanceOf(Object);
    });

    it('should return a lesson with an array of author', async () => {
      const response = await testContext.request({
        method: 'GET',
        url: `lesson/enroll/${lessonToGet.lesson.id}`,
      });

      const payload = JSON.parse(response.payload);

      expect(payload.lesson).toHaveProperty('author');
      expect(payload.lesson.author).toBeInstanceOf(Object);
      expect(payload.lesson.author).toHaveProperty('id');
      expect(payload.lesson.author).toHaveProperty('firstName');
      expect(payload.lesson.author).toHaveProperty('lastName');
    });
  });
});
